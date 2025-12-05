import { useState, useEffect } from "react";

import { getPlayer, getRewardStatus, updatePlayerResult, updateRewardCount } from "../api/api_game1";

import "./game1.css";

import { useNavigate } from "react-router-dom";



export default function Game1() {

    const navigate = useNavigate();



    const [employeeID, setEmployeeID] = useState("");

    const [player, setPlayer] = useState(null);

    const [rewardResult, setRewardResult] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(false);

    const [rewards, setRewards] = useState({

        Reward1: 0,

        Reward2: 0,

        Reward3: 0,

    });



    // โหลดจำนวนรางวัลคงเหลือ

    const fetchRewards = async () => {

        const data = await getRewardStatus();

        if (data.status === "success") setRewards(data.data);

    };



    useEffect(() => {

        fetchRewards();

    }, []);



    // Validate player

    const validatePlayer = async () => {

        if (!employeeID) return alert("กรุณากรอกรหัสพนักงาน");



        const data = await getPlayer(employeeID);



        if (data.status === "error" || !data.data) {

            alert("ไม่พบข้อมูลพนักงานในระบบ");

            return;

        }





        if (data.data.game1.played === true) {

            alert("พนักงานนี้เล่นแล้ว");

            setEmployeeID("");

            return;

        }





        setPlayer(data.data);

    };



    // Random logic (500, 300, 100)

    const randomPrize = () => {

        const available = [];



        if (rewards.Reward1 > 0) available.push({ type: 1, money: 500 });

        if (rewards.Reward2 > 0) available.push({ type: 2, money: 300 });

        if (rewards.Reward3 > 0) available.push({ type: 3, money: 100 }); // ✔ แก้เป็น 100



        if (available.length === 0) {

            alert("รางวัลหมดแล้ว");

            return null;

        }



        return available[Math.floor(Math.random() * available.length)];

    };



    const handleSpin = async () => {

        if (!player) return;



        setLoading(true);



        setTimeout(async () => {

            const reward = randomPrize();

            if (!reward) return;



            // Update player

            console.log("update player :", player.employee_id);

            const rewardResult = {

                employee_id: player.employee_id,

                played: true,

                reward: reward.money

            }

            const responseUpdatePlayer = await updatePlayerResult(rewardResult);



            if (responseUpdatePlayer.status === "error") {

                alert(responseUpdatePlayer.msg);

                setLoading(false);

                return;

            }



            // Update reward count

            await updateRewardCount(reward.type);



            // Refresh UI

            await fetchRewards();



            // แสดงผลรางวัล

            setRewardResult(reward);

            setLoading(false);

            setShowModal(true);

        }, 2000);

    };



    // ปิด modal + reset UI

    const resetGame = () => {

        setShowModal(false);

        setEmployeeID("");

        setPlayer(null);

        setRewardResult(null);

    };



    return (

        <div className="game1-container">

            <h1>🎁 Game 1 – Lucky Reward</h1>



            {/* Reward Status */}

            <div className="reward-box">

                <p>รางวัล 500 บาท: <b>{rewards.Reward1}</b></p>

                <p>รางวัล 300 บาท: <b>{rewards.Reward2}</b></p>

                <p>รางวัล 100 บาท: <b>{rewards.Reward3}</b></p>

            </div>



            {!player && (
                <div className="validate-box">
                    <h2>🔰 กรุณากรอกรหัสพนักงาน</h2>

                    <input
                        className="employee-input"
                        placeholder="เช่น PM00001"
                        value={employeeID}
                        onChange={(e) => setEmployeeID(e.target.value)}
                    />

                    <button className="validate-btn" onClick={validatePlayer}>
                        ตรวจสอบ ➜
                    </button>
                </div>
            )}


            {player && (

                <div className="player-info">

                    <p>ชื่อ: {player.fname_lname}</p>

                    <p>รหัส: {player.employee_id}</p>



                    {player.Game1?.Played === true ? (

                        <p className="already-played">พนักงานนี้เล่นแล้ว</p>

                    ) : (

                        <button onClick={handleSpin} disabled={loading || (rewards.Reward1 + rewards.Reward2 + rewards.Reward3 === 0)}>

                            {loading ? "กำลังสุ่ม..." : "กดเพื่อสุ่มรางวัล 🎉"}

                        </button>

                    )}

                </div>

            )}







            {/* Modal Result */}

            {showModal && (

                <div className="modal-bg">

                    <div className="modal-box">

                        <h2>🎉 คุณได้รับรางวัล!</h2>

                        <p>รางวัลเงินสด: <b>{rewardResult.money}</b> บาท</p>

                        <button onClick={resetGame} >ปิด</button>

                    </div>

                </div>

            )}



            <button className="back-btn" onClick={() => navigate("/")}>

                🔙 กลับหน้าหลัก

            </button>

        </div>

    );

}