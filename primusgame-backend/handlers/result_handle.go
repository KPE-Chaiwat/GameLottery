package handlers

import (
	"log"

	"primusgame-backend/config"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetConcludeResult(c *fiber.Ctx) error {

	col := config.DB("primusgame").Collection("Reward")

	var rewardDoc bson.M
	err := col.FindOne(c.Context(), bson.M{}).Decode(&rewardDoc)
	if err != nil {
		log.Println("❌ Cannot fetch Reward collection:", err)
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"msg":     "cannot load reward data",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    rewardDoc,
	})
}
