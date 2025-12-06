// models/game2.go
package models

type DetailGame2 struct {
	Played bool `json:"played" bson:"Played"`
	Match  bool `json:"match" bson:"Match"`
}

// type Game2Winner struct {
// 	EmployeeID string `json:"employee_id" bson:"EmployeeID"`
// 	Name       string `json:"name" bson:"Name"`
// 	MatchedNum string `json:"matched_num" bson:"MatchedNum"`
// }
