package services

import (
	"context"
	"errors"
	"log"

	"primusgame-backend/config"
	"primusgame-backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ฟังก์ชัน helper สำหรับดึง collection แบบปลอดภัย
func rewardCol() *mongo.Collection {
	return config.DB("primusgame").Collection("Reward")
}

// ----------------------------------------------------
// GET reward
// ----------------------------------------------------
func GetGame1RewardService() (*models.Game1Reward, error) {
	var reward models.RewardDocument

	err := rewardCol().FindOne(context.Background(), bson.M{}).Decode(&reward)
	if err != nil {
		log.Println("Reward not found:", err)
		return nil, errors.New("reward data not found")
	}

	return &reward.Game1, nil
}

// ----------------------------------------------------
// UPDATE reward
// ----------------------------------------------------
func UpdateGame1RewardService(rewardType int) error {
	updateField := ""

	switch rewardType {
	case 1:
		updateField = "game1.Reward1"
	case 2:
		updateField = "game1.Reward2"
	case 3:
		updateField = "game1.Reward3"
	default:
		return errors.New("reward type must be 1, 2 or 3")
	}

	update := bson.M{
		"$inc": bson.M{updateField: -1},
	}

	_, err := rewardCol().UpdateOne(context.Background(), bson.M{}, update)
	if err != nil {
		log.Println("❌ Update reward failed:", err)
		return errors.New("cannot update reward")
	}

	return nil
}
