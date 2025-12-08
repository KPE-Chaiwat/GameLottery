package handlers

import (
	"log"
	"primusgame-backend/models"
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

func UpdateGame1(c *fiber.Ctx) error {
	var req models.UpdateGame1Request

	log.Printf("Raw Body: %s", string(c.Body()))

	if err := c.BodyParser(&req); err != nil {
		log.Printf("BodyParser error: %v", err)
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    "invalid request body",
		})
	}

	log.Printf("Parsed Request: %+v", req)

	if req.EmployeeID == "" {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    "employee_id is required",
		})
	}

	// -----------------------------------
	// 1) ดึงข้อมูล Player จาก EmployeeID
	// -----------------------------------
	player, err := services.GetPlayerByEmployeeID(req.EmployeeID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"status": "error",
			"msg":    "player not found",
		})
	}

	// -----------------------------------
	// 2) เช็คว่าเคยเล่นแล้วหรือยัง
	// -----------------------------------
	// Safe check: ถ้าเคยเล่นแล้ว → ห้ามเล่นซ้ำ
	if player.Game1.Played != nil && *player.Game1.Played {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    "this player has played",
		})
	}

	// -----------------------------------
	// 3) Update ทั้ง Player และ Reward
	// -----------------------------------
	err = services.UpdatePlayerAndReward(player, req.Reward)
	if err != nil {
		log.Println("UpdatePlayerAndReward ERROR:", err)
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"msg":    err.Error(),
		})
	}

	// -----------------------------------
	// 4) Success
	// -----------------------------------
	return c.JSON(fiber.Map{
		"status": "success",
		"msg":    "game1 updated",
	})
}
