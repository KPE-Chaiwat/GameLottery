import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";
import "./game4.css";

import {
    getGame4Data,
    playGame4Round,
    playGame4Final
} from "../api/api_game4";


// ===============================
//  Pure function - no issue here
// ===============================
function generateRandomBirthday() {
    let DD = Math.floor(Math.random() * 31) + 1;  // 1–31
    let MM = Math.floor(Math.random() * 12) + 1;  // 1–12

    return `${DD.toString().padStart(2, "0")}/${MM
        .toString()
        .padStart(2, "0")}`;
}
export default function Game4() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [rounds, setRounds] = useState([]);
    const [accumulate, setAccumulate] = useState(0);
    const [resultModal, setResultModal] = useState(null);
    const [finalModal, setFinalModal] = useState(null);

    const [currentBirth, setCurrentBirth] = useState("");

    // -------------------------------
    // Load initial Game4 data
    // -------------------------------
    const loadData = async () => {
        const res = await getGame4Data();
        if (res.success) {
            setRounds(res.data.rounds);
            const acc = res.data.rounds.reduce((s, r) => s + r.accumulate, 0);
            setAccumulate(acc);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // // -------------------------------
    // // Random Birthday
    // // -------------------------------
    // const randomBirthday = () => {
    //     let DD = Math.floor(Math.random() * 31) + 1; // 1–31
    //     let MM = Math.floor(Math.random() * 12) + 1; // 1–12

    //     const date = `${DD.toString().padStart(2, "0")}/${MM.toString().padStart(2, "0")}`;
    //     setCurrentBirth(date);
    //     return date;
    // };

 const handlePlayRound = async (roundIndex) => {
    const round = roundIndex + 1;

    const date = generateRandomBirthday();
    setCurrentBirth(date);

    setLoading(true);

    const res = await playGame4Round(round, date);

    setLoading(false);

    if (!res.success) {
        alert("เกิดข้อผิดพลาด");
        return;
    }

    setResultModal({
        round,
        date,
        winners: res.winners
    });

    await loadData();
};


    // -------------------------------
    // Final Employee Random
    // -------------------------------
    const handleFinalRandom = async () => {
        setLoading(true);
        const res = await playGame4Final();
        setLoading(false);

        if (res.success) {
            setFinalModal(res.winner);
        }
    };

    return (
        <div className="game4-container">

            {/* Toolbar */}
            <header className="header-common">
                <div className="header-content-common">
                    <button className="back-btn-common" onClick={() => navigate("/")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                             strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        กลับ
                    </button>

                    <h2 style={{ color: "white", marginLeft: "20px" }}>
                        🎂 Game 4 – Birthday Reward
                    </h2>
                </div>
            </header>

            <main className="game4-main">

                {/* Accumulate Section */}
                <div className="accumulate-box">
                    <h3>💰 เงินสะสมปัจจุบัน</h3>
                    <div className="acc-value">{accumulate.toLocaleString()} บาท</div>
                </div>

                {/* Round Buttons */}
                <div className="round-section">
                    <h3>🎯 สุ่มวันเกิด 5 ครั้ง</h3>

                    <div className="round-grid">
                        {rounds.map((r, i) => (
                            <button
                                key={i}
                                className={`round-btn ${r.date ? "disabled" : ""}`}
                                disabled={!!r.date}
                                onClick={() => handlePlayRound(i)}
                            >
                                รอบที่ {i + 1}
                                <br />
                                {r.date ? `🎉 ${r.date}` : "สุ่มเลย"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Final Section */}
                <div className="final-section">
                    <h3>🏆 สุ่มพนักงาน (กรณีไม่พบผู้เกิดครบ 5 ครั้ง)</h3>

                    <button
                        className="final-btn"
                        disabled={rounds.some(r => r.winners.length > 0)}
                        onClick={handleFinalRandom}
                    >
                        สุ่มผู้โชคดี 🎉
                    </button>
                </div>
            </main>

            {/* Result Modal */}
            {resultModal && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <h2>🎉 ผลการสุ่มรอบที่ {resultModal.round}</h2>
                        <p>วันเกิดที่ออก: <b>{resultModal.date}</b></p>

                        {resultModal.winners.length === 0 ? (
                            <p style={{ color: "red" }}>❌ ไม่มีพนักงานเกิดในวันดังกล่าว</p>
                        ) : (
                            resultModal.winners.map((w, i) => (
                                <div key={i} className="winner-card">
                                    <p>{w.fname_lname}</p>
                                    <p>ID: {w.employee_id}</p>
                                </div>
                            ))
                        )}

                        <button onClick={() => setResultModal(null)}>ปิด</button>
                    </div>
                </div>
            )}

            {/* Final Winner Modal */}
            {finalModal && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <h2>🏆 ผู้ชนะ FINAL</h2>
                        <p>{finalModal.fname_lname}</p>
                        <p>ID: {finalModal.employee_id}</p>
                        <h3>รับเงินรางวัล 10,000 บาท</h3>

                        <button onClick={() => setFinalModal(null)}>ปิด</button>
                    </div>
                </div>
            )}

            {/* Loading Modal */}
            {loading && (
                <div className="modal-bg">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
}
