// primusgame-backend/routes/game3_routes.go
package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Game3Routes(app fiber.Router) {

	// โหลดประวัติ Game3 หรือผลล่าสุด
	app.Get("/played", handlers.GetGame3)

	// เล่นเกม Game3
	app.Post("/play", handlers.PlayGame3)
}
