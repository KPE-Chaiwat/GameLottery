package routes

import (
	"primusgame-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func GameResultRoutes(app fiber.Router) {

	app.Get("/", handlers.GetConcludeResult)

}
