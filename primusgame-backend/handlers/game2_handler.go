// handlers/game2_handler.go
package handlers

import (
	"log"

	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

type Game2Request struct {
	Number string `json:"number"`
}

func PlayGame2(c *fiber.Ctx) error {

	log.Println("====================================")
	log.Println("🔥 ENTER PlayGame2 Handler")
	log.Printf("🔥 Raw Body: %s\n", string(c.Body()))
	log.Println("====================================")

	var body Game2Request

	if err := c.BodyParser(&body); err != nil {
		log.Println("❌ BodyParser Error:", err)
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"msg":     "invalid body",
		})
	}

	log.Println("➡ Parsed Body Number =", body.Number)

	// ค้นหาพนักงาน
	player, err := services.FindEmployeeByLast3Digits(body.Number)

	if err != nil {
		log.Println("❌ No employee matched with last 3 digits:", body.Number)
		log.Println("❌ Service Error:", err)
		return c.JSON(fiber.Map{
			"success": false,
			"msg":     "ไม่พบพนักงานที่ตรงกับหมายเลข",
		})
	}

	log.Println("🎉 FOUND EMPLOYEE")
	log.Printf("👉 ID: %v\n", player.ID)
	log.Printf("👉 EmployeeID: %v\n", player.EmployeeID)
	log.Printf("👉 Fullname: %v\n", player.FnameLname)

	// Update
	log.Println("➡ Updating Game2 for player...")
	err = services.UpdateGame2Winner(player, body.Number)

	if err != nil {
		log.Println("❌ Update Error:", err)
		return c.JSON(fiber.Map{
			"success": false,
			"msg":     "update error",
		})
	}

	log.Println("✅ Update Success! Game2 Winner Saved.")
	log.Println("====================================")

	return c.JSON(fiber.Map{
		"success": true,
		"msg":     "found winner",
		"data":    player,
	})
}
