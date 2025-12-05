// primusgame-backend/routes/game1_routes.go
package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Game1Routes(app fiber.Router) {
	app.Get("/players", handlers.GetGame1Players)
	app.Get("/player/:id", handlers.GetPlayerByEmployeeID)
	app.Post("/player/update", handlers.UpdateGame1)

	// 🔥 Reward API
	app.Get("/reward", handlers.GetGame1Reward)
	app.Post("/reward/update", handlers.UpdateGame1Reward)
}
