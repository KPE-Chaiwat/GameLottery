package handlers

import (
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

func GetPlayerByEmployeeID(c *fiber.Ctx) error {
	employeeID := c.Params("id")

	if employeeID == "" {
		return c.Status(400).JSON(fiber.Map{
			"status": "error",
			"msg":    "EmployeeID is required",
		})
	}

	player, err := services.GetPlayerByEmployeeID(employeeID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"status": "not_found",
			"msg":    "Employee not found",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   player,
	})
}
