// routes/game2_routes.go
package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Game2Routes(app fiber.Router) {
	app.Post("/play", handlers.PlayGame2)
}
