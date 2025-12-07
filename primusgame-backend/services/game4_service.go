package services

import (
	"context"
	"errors"
	"log"
	"math/rand"
	"primusgame-backend/config"
	"primusgame-backend/models"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// GET Reward Document (Game4)
func GetGame4Data() (*models.RewardDocument, error) {

	rewardCol := config.DB("primusgame").Collection("Reward")
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")

	var reward models.RewardDocument

	err := rewardCol.FindOne(context.Background(), bson.M{"_id": rewardID}).Decode(&reward)
	if err != nil {
		log.Println("❌ [GetGame4Data] Reward not found:", err)
		return nil, err
	}

	// ✅ เรียก Auto Initialize ถ้าข้อมูลไม่พร้อม
	initGame4IfNeeded(&reward)

	// โหลดใหม่หลังจาก initialize
	rewardCol.FindOne(context.Background(), bson.M{"_id": rewardID}).Decode(&reward)

	return &reward, nil
}

// ค้นหาคนที่เกิดตรงวัน (DD/MM)
func FindBirthdayWinners(date string) ([]models.Player, error) {
	col := config.DB("primusgame").Collection("players")

	filter := bson.M{"Brithday": date}

	cursor, err := col.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}

	var players []models.Player
	err = cursor.All(context.Background(), &players)
	return players, err
}

// อัปเดตผู้ชนะ Game4
func UpdateGame4Round(round int, date string, winners []models.Player, accumulate int) error {

	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")
	rewardCol := config.DB("primusgame").Collection("Reward")
	playerCol := config.DB("primusgame").Collection("players")

	index := strconv.Itoa(round - 1) // 👈 ใช้ ITOA เท่านั้น

	// ========================================================
	// CASE 1: ไม่มีผู้ชนะ → เพิ่มเงินสะสม (accumulate + 2000)
	// ========================================================
	if len(winners) == 0 {

		_, err := rewardCol.UpdateByID(
			context.Background(),
			rewardID,
			bson.M{
				"$set": bson.M{
					"game4.rounds." + index + ".date":       date,
					"game4.rounds." + index + ".accumulate": accumulate + 2000,
					"game4.rounds." + index + ".winners":    []interface{}{},
				},
			},
		)

		return err
	}

	// ========================================================
	// CASE 2: มีผู้ชนะ → แจกเงินรางวัล
	// ========================================================

	total := accumulate + 2000
	rewardPerPerson := total / len(winners)

	// ล้าง winners เดิม
	_, _ = rewardCol.UpdateByID(
		context.Background(),
		rewardID,
		bson.M{"$set": bson.M{
			"game4.rounds." + index + ".winners": []interface{}{},
		}},
	)

	// INSERT ผู้ชนะลง Reward
	for _, p := range winners {

		entry := bson.M{
			"EmployeeID": p.EmployeeID,
			"Name":       p.FnameLname,
			"Reward":     rewardPerPerson,
			"Date":       date,
			"Time":       primitive.NewDateTimeFromTime(time.Now()),
		}

		_, _ = rewardCol.UpdateByID(
			context.Background(),
			rewardID,
			bson.M{
				"$push": bson.M{
					"game4.rounds." + index + ".winners": entry,
				},
			},
		)

		// UPDATE player document
		playerObjID, err := primitive.ObjectIDFromHex(p.ID)
		if err != nil {
			log.Println("❌ Invalid player ID:", p.ID)
			continue
		}

		_, err = playerCol.UpdateByID(
			context.Background(),
			playerObjID,
			bson.M{
				"$set": bson.M{
					"Game4": bson.M{
						"Played": true,
						"Match":  true,
						"Reward": rewardPerPerson,
						"Date":   date,
						"Round":  round,
					},
				},
			},
		)
		if err != nil {
			log.Println("❌ Update player failed:", err)
		} else {
			log.Println("✅ Player updated:", p.EmployeeID)
		}

	}

	// Reset accumulate
	_, _ = rewardCol.UpdateByID(
		context.Background(),
		rewardID,
		bson.M{
			"$set": bson.M{
				"game4.rounds." + index + ".accumulate": 0,
				"game4.rounds." + index + ".date":       date,
			},
		},
	)

	return nil
}

// Final Winner (สุ่มพนักงานกรณีไม่มีใครเลย 5 รอบ)
func Game4FinalWinner(acc int) (*models.Player, error) {

	col := config.DB("primusgame").Collection("players")

	// random employee 1 คน
	cursor, err := col.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}

	var players []models.Player
	cursor.All(context.Background(), &players)

	if len(players) == 0 {
		return nil, errors.New("no employees found")
	}

	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	winner := players[r.Intn(len(players))]

	// update reward
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")
	rewardCol := config.DB("primusgame").Collection("Reward")
	playerCol := config.DB("primusgame").Collection("players")

	entry := models.Game4Winner{
		EmployeeID: winner.EmployeeID,
		Name:       winner.FnameLname,
		Reward:     acc,
		Time:       primitive.NewDateTimeFromTime(time.Now()),
	}

	_, _ = rewardCol.UpdateByID(context.Background(), rewardID,
		bson.M{"$set": bson.M{"game4.finalWinner": entry}})

	_, _ = playerCol.UpdateByID(context.Background(), winner.ID,
		bson.M{"$set": bson.M{"Game4Final": entry.Reward}})

	return &winner, nil
}

// Auto initialize Game4 in reward document if not exists
func initGame4IfNeeded(reward *models.RewardDocument) error {

	rewardCol := config.DB("primusgame").Collection("Reward")
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")

	// ถ้าไม่มี game4 หรือ rounds ไม่ครบ 5 ให้สร้างใหม่
	if reward.Game4.Rounds == nil || len(reward.Game4.Rounds) != 5 {

		log.Println("⚠️  [Game4] Missing or invalid Game4 data → Auto initialize...")

		newRounds := []models.Game4Round{}
		for i := 1; i <= 5; i++ {
			newRounds = append(newRounds, models.Game4Round{
				Round:      i,
				Date:       "",
				Winners:    []models.Game4Winner{},
				Accumulate: 2000,
			})
		}

		update := bson.M{
			"$set": bson.M{
				"game4.rounds":      newRounds,
				"game4.finalWinner": nil,
			},
		}

		_, err := rewardCol.UpdateByID(context.Background(), rewardID, update)
		if err != nil {
			log.Println("❌ [Game4] Auto Init FAILED:", err)
			return err
		}

		log.Println("✅ [Game4] Auto Init SUCCESS!")
	}

	return nil
}
