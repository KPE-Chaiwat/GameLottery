package services

import (
	"context"
	"fmt"
	"log"
	"primusgame-backend/config"
	"primusgame-backend/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func FindEmployeeByLast3Digits(num string) (*models.Player, error) {
	collection := config.DB("primusgame").Collection("players")

	filter := bson.M{
		"EmployeeID": bson.M{
			"$regex": num + "$",
		},
	}

	log.Println("🔍 Searching Employee with last 3 digits:", num)

	var player models.Player
	err := collection.FindOne(context.Background(), filter).Decode(&player)
	if err != nil {
		log.Println("❌ Employee not found:", err)
		return nil, err
	}

	log.Println("✅ FOUND:", player.EmployeeID, player.FnameLname)
	return &player, nil
}

func UpdateGame2Winner(player *models.Player, matchedNumber string) error {

	// -------------------------
	// 1) UPDATE PLAYER.GAME2
	// -------------------------
	playerCol := config.DB("primusgame").Collection("players")

	objID, err := primitive.ObjectIDFromHex(fmt.Sprintf("%v", player.ID))
	if err != nil {
		log.Println("❌ INVALID PLAYER OBJECT ID:", player.ID)
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"Game2": bson.M{
				"Played": true,
				"Match":  true,
				"Number": matchedNumber,
				"Time":   time.Now(),
			},
		},
	}

	log.Println("➡ Updating Game2 for player:", objID)

	result, err := playerCol.UpdateByID(context.Background(), objID, update)
	if err != nil {
		log.Println("❌ UpdateByID ERROR:", err)
		return err
	}

	log.Printf("✅ Player Game2 Updated | Matched=%v | Modified=%v",
		result.MatchedCount, result.ModifiedCount)

	// -------------------------
	// UPDATE reward.game2 (no need for ID)
	// -------------------------
	rewardCol := config.DB("primusgame").Collection("Reward")

	pushEntry := bson.M{
		"EmployeeID": player.EmployeeID,
		"Name":       player.FnameLname,
		"MatchedNum": matchedNumber,
		"Time":       time.Now(),
	}

	log.Println("➡ Pushing winner to Reward.game2:", pushEntry)

	result2, err := rewardCol.UpdateOne(
		context.Background(),
		bson.M{}, // <---- IMPORTANT: update first document
		bson.M{"$push": bson.M{"game2": pushEntry}},
	)

	if err != nil {
		log.Println("❌ Reward update error:", err)
		return err
	}

	log.Printf("✅ Reward Update | Matched=%v | Modified=%v",
		result2.MatchedCount, result2.ModifiedCount)

	return nil
}
