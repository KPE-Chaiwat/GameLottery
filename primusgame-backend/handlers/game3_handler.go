package handlers

import (
	"log"
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

type Game3Request struct {
	Set1 string `json:"set1"`
	Set2 string `json:"set2"`
	Set3 string `json:"set3"`
}

// -------------------------------------------
// GET: โหลดข้อมูลผล Game3 ล่าสุด
// -------------------------------------------
func GetGame3(c *fiber.Ctx) error {

	reward, err := services.GetRewardData()
	if err != nil {
		return c.JSON(fiber.Map{
			"success": false,
			"msg":     "reward data not found",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    reward.Game3,
	})
}

// -------------------------------------------
// POST: เล่นเกม Game3
// -------------------------------------------
func PlayGame3(c *fiber.Ctx) error {

	log.Println("🔥 [Game3] ENTER PlayGame3 Handler")

	var body Game3Request
	if err := c.BodyParser(&body); err != nil {
		log.Println("❌ invalid body")
		return c.JSON(fiber.Map{"success": false, "msg": "invalid body"})
	}

	log.Printf("➡ Set1=%s | Set2=%s | Set3=%s\n", body.Set1, body.Set2, body.Set3)

	// Step 1 — ค้นหาผู้ชนะแต่ละชุด
	winners1, _ := services.FindWinners(body.Set1)
	winners2, _ := services.FindWinners(body.Set2)
	winners3, _ := services.FindWinners(body.Set3)

	// รวมเป็นหนึ่งชุด
	allWinners := append(winners1, winners2...)
	allWinners = append(allWinners, winners3...)

	log.Printf("🎉 Found Winners = %d people\n", len(allWinners))

	// Step 2 — Update Reward Collection + Update Player Game3
	err := services.UpdateGame3Winners(body.Set1, body.Set2, body.Set3, allWinners)
	if err != nil {
		log.Println("❌ UpdateGame3Winners ERROR:", err)
		return c.JSON(fiber.Map{
			"success": false,
			"msg":     "update failed",
		})
	}

	log.Println("✅ Game3 update completed")

	return c.JSON(fiber.Map{
		"success": true,
		"msg":     "complete",
		"winners": allWinners,
	})
}
