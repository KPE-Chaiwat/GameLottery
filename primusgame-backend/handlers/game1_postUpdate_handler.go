package handlers

import (
	"log"
	"primusgame-backend/models"
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

func UpdateGame1(c *fiber.Ctx) error {
	var req models.UpdateGame1Request

	// Log raw body for debugging
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

	// เรียก service
	err := services.UpdateGame1ByEmployeeID(req)
	if err != nil {
		if err.Error() == "player not found" {
			return c.Status(404).JSON(fiber.Map{
				"status": "error",
				"msg":    "player not found",
			})
		}

		if err.Error() == "this player has played" {
			return c.Status(400).JSON(fiber.Map{
				"status": "error",
				"msg":    "this player has played",
			})
		}

		// อื่น ๆ จาก DB
		return c.Status(500).JSON(fiber.Map{
			"status": "error",
			"msg":    err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"msg":    "game1 updated",
	})
}
