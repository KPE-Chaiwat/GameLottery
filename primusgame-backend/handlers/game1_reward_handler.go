package handlers

import (
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

func GetGame1Reward(c *fiber.Ctx) error {
	reward, err := services.GetGame1RewardService()
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"status": "error",
			"msg":    err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   reward,
	})
}

func UpdateGame1Reward(c *fiber.Ctx) error {
	var payload struct {
		Type int `json:"type"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    "invalid body",
		})
	}

	err := services.UpdateGame1RewardService(payload.Type)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"msg":    "reward updated",
	})
}
