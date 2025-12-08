package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func GameReset(app fiber.Router) {

	app.Post("/all", handlers.ResetAll)

}
