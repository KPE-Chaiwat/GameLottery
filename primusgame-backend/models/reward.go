package models

type Game1Reward struct {
	Reward1 int `json:"Reward1" bson:"Reward1"`
	Reward2 int `json:"Reward2" bson:"Reward2"`
	Reward3 int `json:"Reward3" bson:"Reward3"`
}

type RewardDocument struct {
	ID    string      `json:"id" bson:"_id,omitempty"`
	Game1 Game1Reward `json:"game1" bson:"game1"`
}
