package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GAME 1
type Game1Reward struct {
	Reward1 int `json:"Reward1" bson:"Reward1"`
	Reward2 int `json:"Reward2" bson:"Reward2"`
	Reward3 int `json:"Reward3" bson:"Reward3"`
}

// GAME 2 Winner
type Game2Winner struct {
	EmployeeID string             `json:"EmployeeID" bson:"EmployeeID"`
	Name       string             `json:"Name" bson:"Name"`
	MatchedNum string             `json:"MatchedNum" bson:"MatchedNum"`
	Time       primitive.DateTime `json:"Time" bson:"Time"`
}

// GAME 3 Winner
type Game3Winner struct {
	EmployeeID string             `json:"EmployeeID" bson:"EmployeeID"`
	Name       string             `json:"Name" bson:"Name"`
	Matched    string             `json:"Matched" bson:"Matched"`
	Time       primitive.DateTime `json:"Time" bson:"Time"`
}

// GAME 4 Winner
type Game4Winner struct {
	EmployeeID string             `json:"EmployeeID" bson:"EmployeeID"`
	Name       string             `json:"Name" bson:"Name"`
	Reward     int                `json:"Reward" bson:"Reward"`
	Time       primitive.DateTime `json:"Time" bson:"Time"`
}

// GAME 4 Round
type Game4Round struct {
	Round      int           `json:"round" bson:"round"`
	Date       string        `json:"date" bson:"date"`
	Winners    []Game4Winner `json:"winners" bson:"winners"`
	Accumulate int           `json:"accumulate" bson:"accumulate"`
}

// Reward Document
type RewardDocument struct {
	ID    primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Game1 Game1Reward        `json:"game1" bson:"game1"`
	Game2 []Game2Winner      `json:"game2" bson:"game2"`

	Game3 struct {
		Number1    string        `json:"number1" bson:"number1"`
		Number2    string        `json:"number2" bson:"number2"`
		Number3    string        `json:"number3" bson:"number3"`
		PlayersWin []Game3Winner `json:"playersWin" bson:"playersWin"`
	} `json:"game3" bson:"game3"`

	Game4 struct {
		Rounds      []Game4Round `json:"rounds" bson:"rounds"`
		FinalWinner *Game4Winner `json:"finalWinner" bson:"finalWinner"`
	} `json:"game4" bson:"game4"`
}
