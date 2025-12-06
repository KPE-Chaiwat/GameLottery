package models

type Game3 struct {
	Number1    string        `bson:"number1" json:"number1"`
	Number2    string        `bson:"number2" json:"number2"`
	Number3    string        `bson:"number3" json:"number3"`
	PlayersWin []Game3Winner `bson:"playersWin" json:"playersWin"`
}

// type Game3Winner struct {
//     EmployeeID string `bson:"EmployeeID" json:"employee_id"`
//     Name       string `bson:"Name" json:"name"`
//     Matched    string `bson:"Matched" json:"matched"`
//     Time       string `bson:"Time" json:"time"`
// }
