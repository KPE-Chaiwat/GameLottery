package handlers

import (
	"context"
	"log"

	"primusgame-backend/config"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ResetRequest struct {
	AdminID          string         `json:"admin_id"`
	AdminPass        string         `json:"admin_pass"`
	Players          []bson.M       `json:"players"`
	RewardCountGame1 map[string]int `json:"rewardCountGame1"`
}

func ResetAll(c *fiber.Ctx) error {
	var body ResetRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"msg": "invalid body"})
	}

	// validate admin
	if body.AdminID != "primus" || body.AdminPass != "11223344" {
		return c.Status(403).JSON(fiber.Map{"msg": "unauthorized"})
	}

	ctx := context.Background()
	db := config.DB("primusgame")

	playerCol := db.Collection("players")
	rewardCol := db.Collection("Reward")

	// 1) ลบ players ทั้งหมด
	_, _ = playerCol.DeleteMany(ctx, bson.M{})

	// 2) Insert players ใหม่
	var insertPlayers []interface{}
	for _, p := range body.Players {
		// เพิ่ม Game1/2/3/4 default
		p["Game1"] = bson.M{"Played": false, "Reward": 0}
		p["Game2"] = bson.M{"Played": false, "Matched": ""}
		p["Game3"] = bson.M{"Played": false, "Matched": ""}
		p["Game4"] = bson.M{"Played": false, "Reward": 0, "Date": ""}
		insertPlayers = append(insertPlayers, p)
	}
	_, err := playerCol.InsertMany(ctx, insertPlayers)
	if err != nil {
		log.Println("Insert players error:", err)
		return c.Status(500).JSON(fiber.Map{"msg": "insert players error"})
	}

	// 3) Reset reward
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")

	rewardDoc := bson.M{
		"_id": rewardID,
		"game1": bson.M{
			"Reward1":   body.RewardCountGame1["Reward1"],
			"Reward2":   body.RewardCountGame1["Reward2"],
			"Reward3":   body.RewardCountGame1["Reward3"],
			"winner100": []interface{}{},
			"winner300": []interface{}{},
			"winner500": []interface{}{},
		},
	}
	// ลบ doc เดิมก่อน
	rewardCol.DeleteMany(ctx, bson.M{"_id": rewardID})

	_, err = rewardCol.InsertOne(ctx, rewardDoc)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"msg": "reset reward error"})
	}

	return c.JSON(fiber.Map{"success": true, "msg": "Reset done"})
}
