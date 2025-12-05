package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Mongo *mongo.Client

func ConnectMongo(uri string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("❌ Mongo connection error:", err)
	}

	// test connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("❌ Mongo ping failed:", err)
	}

	log.Println("✅ MongoDB connected!")
	Mongo = client
}

func DB(dbName string) *mongo.Database {
	return Mongo.Database(dbName)
}
