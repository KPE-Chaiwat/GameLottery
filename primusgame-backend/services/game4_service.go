package services

import (
	"context"
	// "errors"
	"log"
	"math/rand"
	"primusgame-backend/config"
	"primusgame-backend/models"

	"fmt"
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

func UpdateGame4Round(round int, date string, winners []models.Player) error {
	ctx := context.Background()

	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")
	rewardCol := config.DB("primusgame").Collection("Reward")
	playerCol := config.DB("primusgame").Collection("players")

	index := round - 1

	// -----------------------------
	//  เงินสะสม = 2000 × รอบ
	// -----------------------------
	accumulate := 2000 * round

	// -----------------------------
	//  ถ้าไม่มีผู้ชนะ
	// -----------------------------
	if len(winners) == 0 {
		_, err := rewardCol.UpdateByID(ctx, rewardID,
			bson.M{
				"$set": bson.M{
					"game4.rounds." + strconv.Itoa(index) + ".date":       date,
					"game4.rounds." + strconv.Itoa(index) + ".accumulate": accumulate,
					"game4.rounds." + strconv.Itoa(index) + ".winners":    []interface{}{},
				},
			},
		)
		return err
	}

	// -----------------------------
	//  มีผู้ชนะ → เงินรางวัลต่อคน
	// -----------------------------
	rewardPerPerson := accumulate / len(winners)

	// เคลียร์ winners เดิมก่อน
	_, _ = rewardCol.UpdateByID(ctx, rewardID,
		bson.M{"$set": bson.M{
			"game4.rounds." + strconv.Itoa(index) + ".winners": []interface{}{},
		}},
	)

	// -----------------------------
	//  บันทึกผู้ชนะลง Reward และ Players
	// -----------------------------
	for _, p := range winners {

		// ⭐ แปลง string ID → ObjectID ก่อน update
		objID, err := primitive.ObjectIDFromHex(p.ID)
		if err != nil {
			fmt.Println("❌ Invalid ObjectID:", p.ID)
			continue
		}

		winnerEntry := bson.M{
			"EmployeeID": p.EmployeeID,
			"Name":       p.FnameLname,
			"Reward":     rewardPerPerson,
			"Date":       date,
			"Time":       primitive.NewDateTimeFromTime(time.Now()),
		}

		// บันทึกลง Reward
		_, _ = rewardCol.UpdateByID(
			ctx,
			rewardID,
			bson.M{"$push": bson.M{
				"game4.rounds." + strconv.Itoa(index) + ".winners": winnerEntry,
			}},
		)

		// ⭐ Update ลง players
		_, _ = playerCol.UpdateByID(
			ctx,
			objID,
			bson.M{"$set": bson.M{
				"Game4": bson.M{
					"Played": true,
					"Reward": rewardPerPerson,
					"Date":   date,
				},
			}},
		)
	}

	// update accumulate
	_, _ = rewardCol.UpdateByID(ctx, rewardID,
		bson.M{"$set": bson.M{
			"game4.rounds." + strconv.Itoa(index) + ".accumulate": accumulate,
			"game4.rounds." + strconv.Itoa(index) + ".date":       date,
		}},
	)

	return nil
}

func Game4FinalWinner(reward int) (*models.Player, error) {
	ctx := context.Background()
	playerCol := config.DB("primusgame").Collection("players")
	rewardCol := config.DB("primusgame").Collection("Reward")

	// สุ่มผู้เล่นทั้งหมด
	cursor, _ := playerCol.Find(ctx, bson.M{})
	var players []models.Player
	cursor.All(ctx, &players)

	rand.Seed(time.Now().UnixNano())
	winner := players[rand.Intn(len(players))]

	// อัปเดต Reward Collection
	rewardID, _ := primitive.ObjectIDFromHex("693283f45d9650012f58447d")
	entry := bson.M{
		"EmployeeID": winner.EmployeeID,
		"Name":       winner.FnameLname,
		"Reward":     reward,
		"Date":       "FINAL",
		"Time":       primitive.NewDateTimeFromTime(time.Now()),
	}

	_, _ = rewardCol.UpdateByID(ctx, rewardID,
		bson.M{"$set": bson.M{"game4.finalWinner": entry}},
	)

	// อัปเดต Players
	objID, _ := primitive.ObjectIDFromHex(winner.ID)

	_, _ = playerCol.UpdateByID(ctx, objID,
		bson.M{"$set": bson.M{
			"Game4": bson.M{
				"Played": true,
				"Reward": reward,
				"Date":   "FINAL",
			},
		}},
	)

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
