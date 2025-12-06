package services

import (
	"context"
	"log"
	"primusgame-backend/config"
	"primusgame-backend/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// -----------------------------------
// Generate all permutations
// -----------------------------------
func permutations(num string) []string {
	return []string{
		string([]byte{num[0], num[1], num[2]}),
		string([]byte{num[0], num[2], num[1]}),
		string([]byte{num[1], num[0], num[2]}),
		string([]byte{num[1], num[2], num[0]}),
		string([]byte{num[2], num[0], num[1]}),
		string([]byte{num[2], num[1], num[0]}),
	}
}

// -----------------------------------
// Find all matching employees
// -----------------------------------
func FindWinners(set string) ([]models.Player, error) {

	perms := permutations(set)
	regex := "(" + perms[0] + "|" + perms[1] + "|" + perms[2] + "|" + perms[3] + "|" + perms[4] + "|" + perms[5] + ")$"

	playerCol := config.DB("primusgame").Collection("players")

	filter := bson.M{
		"EmployeeID": bson.M{
			"$regex": regex,
		},
	}

	cursor, err := playerCol.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}

	var results []models.Player
	err = cursor.All(context.Background(), &results)
	return results, err
}

// -----------------------------------
// Update Reward + Update players
// -----------------------------------
func UpdateGame3Winners(set1, set2, set3 string, winners []models.Player) error {

	rewardCol := config.DB("primusgame").Collection("Reward")
	playerCol := config.DB("primusgame").Collection("players")

	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")

	// STEP 1 : Update the 3 numbers
	_, err := rewardCol.UpdateByID(
		context.Background(),
		rewardID,
		bson.M{"$set": bson.M{
			"game3.number1":    set1,
			"game3.number2":    set2,
			"game3.number3":    set3,
			"game3.playersWin": []interface{}{}, // clear old data
		}},
	)
	if err != nil {
		log.Println("❌ Failed to update game3 numbers:", err)
		return err
	}

	log.Println("📌 Game3 numbers updated")

	// STEP 2 : Add winners
	for _, p := range winners {

		matched := p.EmployeeID[len(p.EmployeeID)-3:]

		// Create entry
		entry := bson.M{
			"EmployeeID": p.EmployeeID,
			"Name":       p.FnameLname,
			"Matched":    matched,
			"Time":       time.Now(),
		}

		// Push into Reward.game3.playersWin
		_, err := rewardCol.UpdateByID(
			context.Background(),
			rewardID,
			bson.M{"$push": bson.M{"game3.playersWin": entry}},
		)
		if err != nil {
			log.Println("❌ Failed to push reward entry:", err)
			return err
		}

		// Convert Player.ID (string → ObjectID)
		objID, err := primitive.ObjectIDFromHex(p.ID)
		if err != nil {
			log.Println("❌ Invalid ObjectID for player:", p.ID)
			continue
		}

		// Update player document (Add Winner:true)
		_, err = playerCol.UpdateByID(
			context.Background(),
			objID,
			bson.M{"$set": bson.M{
				"Game3": bson.M{
					"Played":  true,
					"Winner":  true, // <<<<<< ADD
					"Matched": true,
					"Number":  matched,
				},
			}},
		)

		if err != nil {
			log.Println("❌ Failed to update player:", p.EmployeeID)
			return err
		}

		log.Println("✅ Updated Player Game3:", p.EmployeeID)
	}

	log.Println("🎉 All Game3 winners updated successfully")
	return nil
}
