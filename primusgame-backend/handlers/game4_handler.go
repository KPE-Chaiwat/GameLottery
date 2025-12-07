package handlers

import (
	"log"
	"primusgame-backend/services"

	"github.com/gofiber/fiber/v2"
)

type Game4RoundRequest struct {
	Round int    `json:"round"`
	Date  string `json:"date"`
}

func GetGame4(c *fiber.Ctx) error {
	data, err := services.GetGame4Data()
	if err != nil {
		return c.JSON(fiber.Map{"success": false})
	}
	return c.JSON(fiber.Map{"success": true, "data": data.Game4})
}

func PlayGame4Round(c *fiber.Ctx) error {

	var body Game4RoundRequest
	if err := c.BodyParser(&body); err != nil {
		return c.JSON(fiber.Map{"success": false, "msg": "invalid body"})
	}

	// ---- LOG BODY ----
	log.Println("📌 [Game4] Round from client =", body.Round)
	log.Println("📌 [Game4] Date from client  =", body.Date)

	game4, _ := services.GetGame4Data()

	// ---- SAFE CHECK ----
	if body.Round <= 0 || body.Round > len(game4.Game4.Rounds) {
		log.Println("❌ [Game4] Round out of range:", body.Round)
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"msg":     "round is out of range or not initialized",
		})
	}

	acc := game4.Game4.Rounds[body.Round-1].Accumulate

	// ค้นหาผู้ชนะ
	winners, _ := services.FindBirthdayWinners(body.Date)

	// update game4
	services.UpdateGame4Round(body.Round, body.Date, winners, acc)

	log.Println("✅ [Game4] Round processed successfully")

	return c.JSON(fiber.Map{
		"success": true,
		"winners": winners,
	})
}

func Game4Final(c *fiber.Ctx) error {

	data, _ := services.GetGame4Data()

	// รวมเงินสะสมทั้งหมด
	total := 0
	for _, r := range data.Game4.Rounds {
		total += r.Accumulate
	}
	total += 2000

	winner, err := services.Game4FinalWinner(total)
	if err != nil {
		return c.JSON(fiber.Map{"success": false})
	}

	return c.JSON(fiber.Map{"success": true, "winner": winner})
}
