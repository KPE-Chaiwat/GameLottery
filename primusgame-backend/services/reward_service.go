package services

import (
	"context"
	"errors"
	"log"

	"primusgame-backend/config"
	"primusgame-backend/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func GetRewardData() (*models.RewardDocument, error) {

	log.Println("🔍 [GetRewardData] Loading Reward Document...")

	collection := config.DB("primusgame").Collection("Reward")

	// Reward Document มีอันเดียว และ ID fix ไว้
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")

	filter := bson.M{"_id": rewardID}

	var reward models.RewardDocument

	err := collection.FindOne(context.Background(), filter).Decode(&reward)
	if err != nil {
		log.Println("❌ [GetRewardData] ERROR:", err)
		return nil, errors.New("reward document not found")
	}

	log.Println("✅ [GetRewardData] Reward Document Loaded Successfully")
	return &reward, nil
}
