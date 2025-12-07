package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func Game4Routes(app fiber.Router) {

	app.Get("/", handlers.GetGame4)
	app.Post("/round", handlers.PlayGame4Round)
	app.Post("/final", handlers.Game4Final)
}
