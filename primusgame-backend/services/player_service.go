package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"primusgame-backend/config"
	"primusgame-backend/models"

	"go.mongodb.org/mongo-driver/bson"
)

func GetPlayers() ([]models.Player, error) {
	collection := config.DB("primusgame").Collection("players")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var players []models.Player
	if err = cursor.All(ctx, &players); err != nil {
		log.Println("❌ Cursor decode error:", err)
		return nil, err
	}

	return players, nil
}

func GetPlayerByEmployeeID(employeeID string) (*models.Player, error) {
	collection := config.DB("primusgame").Collection("players")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var player models.Player

	err := collection.FindOne(ctx, bson.M{"EmployeeID": employeeID}).Decode(&player)
	if err != nil {
		return nil, err
	}

	// ----------------------------------------------
	// ถ้า field Game1 ไม่ได้อยู่ใน MongoDB document
	// player.Game1.Played จะเป็น nil (เพราะ pointer)
	// ----------------------------------------------

	// กรณี Game1 missing → set null value
	if player.Game1.Played == nil {
		player.Game1.Played = nil
	}
	if player.Game1.Reward == nil {
		player.Game1.Reward = nil
	}

	return &player, nil
}

func UpdateGame1ByEmployeeID(req models.UpdateGame1Request) error {
	collection := config.DB("primusgame").Collection("players")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 1) หา player จาก EmployeeID
	var player models.Player
	err := collection.FindOne(ctx, bson.M{"EmployeeID": req.EmployeeID}).Decode(&player)
	if err != nil {
		return fmt.Errorf("player not found")
	}

	// 2) เช็คว่าเคยเล่นเกมแล้วหรือยัง
	if player.Game1.Played != nil && *player.Game1.Played == true {
		return fmt.Errorf("this player has played")
	}

	// 3) Update ค่า Game1
	update := bson.M{
		"$set": bson.M{
			"Game1.Played": req.Played,
			"Game1.Reward": req.Reward,
		},
	}

	_, err = collection.UpdateOne(ctx, bson.M{"EmployeeID": req.EmployeeID}, update)
	if err != nil {
		return fmt.Errorf("cannot update player: %v", err)
	}

	return nil
}
