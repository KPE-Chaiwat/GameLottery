package main

import (
	"log"

	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"primusgame-backend/config"
	"primusgame-backend/routes"
)

func main() {
	app := fiber.New()

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// CONNECT MONGO
	config.ConnectMongo("mongodb://localhost:27017")
	// config logs
	app.Use(logger.New())
	// API GROUP
	api := app.Group("/api")

	// Import Game 1 Routes
	routes.Game1Routes(api.Group("/game1"))
	// import Game 2 Routes
	routes.Game2Routes(api.Group("/game2"))

	//impoet  Game 3 Route
	routes.Game3Routes(api.Group("/game3"))
	//log
	log.Println(app.Stack())

	// Start server
	log.Println("🚀 Server running on :8080")
	app.Listen(":8080")
	//  http://127.0.0.1:8080/api/game1/...routes

}
