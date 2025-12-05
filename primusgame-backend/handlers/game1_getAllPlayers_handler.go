package handlers

import (
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

func GetGame1Players(c *fiber.Ctx) error {
	players, err := services.GetPlayers()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"msg":    "Cannot fetch players",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   players,
	})
}
