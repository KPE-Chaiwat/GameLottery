package models

//---------Game 1 struct

type DetailGame1 struct {
	Played *bool `json:"played" bson:"Played"`
	Reward *int  `json:"reward" bson:"Reward"`
}

//
type UpdateGame1Request struct {
	EmployeeID string `json:"employee_id"`
	Played     bool   `json:"played"`
	Reward     int    `json:"reward"`
}

//Game 2 struct
//main struct
type Player struct {
	ID         string      `json:"id" bson:"_id,omitempty"`
	No         int         `json:"no" bson:"No"`
	EmployeeID string      `json:"employee_id" bson:"EmployeeID"`
	FnameLname string      `json:"fname_lname" bson:"Fname_Lname"`
	Brithday   string      `json:"birthday" bson:"Brithday"`
	Game1      DetailGame1 `json:"game1" bson:"Game1"`
}
