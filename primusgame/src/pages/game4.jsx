import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";
import "./game4.css";

import { getGame4Data, playGame4Round, playGame4Final } from "../api/api_game4";
// เพิ่มฟังก์ชัน delay ไว้ด้านบน
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// -------------------------------
// ฟังก์ชันสุ่มวันเกิดแบบ Pure
// -------------------------------
function generateRandomBirthday() {
  let DD = Math.floor(Math.random() * 31) + 1;
  let MM = Math.floor(Math.random() * 12) + 1;
  return `${DD.toString().padStart(2, "0")}/${MM.toString().padStart(2, "0")}`;
}

// -------------------------------
// Logic ปุ่มแต่ละรอบตามกติกา
// -------------------------------
function isRoundDisabled(roundIndex, rounds) {
  if (rounds[roundIndex].date) return true; // เล่นแล้ว = disable

  if (roundIndex === 0) return false; // รอบ 1 เล่นเสมอ

  // รอบก่อนหน้าต้องเล่นครบ
  for (let i = 0; i < roundIndex; i++) {
    if (!rounds[i].date) return true;
  }

  // ถ้ารอบก่อนหน้ามีผู้ชนะ → หยุดเกม
  for (let i = 0; i < roundIndex; i++) {
    if (rounds[i].winners.length > 0) return true;
  }

  return false;
}

// -------------------------------
// ปุ่มรอบสุดท้าย (สุ่มพนักงาน)
// -------------------------------
function isFinalDisabled(rounds) {
  const allPlayed = rounds.every((r) => r.date !== "");
  const noWinners = rounds.every((r) => r.winners.length === 0);

  return !(allPlayed && noWinners);
}

export default function Game4() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [accumulate, setAccumulate] = useState(0);

  const [resultModal, setResultModal] = useState(null);
  const [finalModal, setFinalModal] = useState(null);

  // -------------------------------
  // โหลดข้อมูลรอบจาก Backend
  // -------------------------------
  const loadData = async () => {
    const res = await getGame4Data();
    if (res.success) {
      setRounds(res.data.rounds);

      const playedCount = res.data.rounds.filter((r) => r.date !== "").length;

      // เงินสะสม = 2000 * จำนวนรอบที่เล่นแล้ว
      const acc = playedCount * 2000;

      setAccumulate(playedCount === 0 ? 2000 : acc);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------
  // สุ่มวันเกิดแต่ละรอบ
  // -------------------------------
  const handlePlayRound = async (roundIndex) => {
    const round = roundIndex + 1;
    const date = generateRandomBirthday();

    setLoading(true);
    await delay(3000);

    const res = await playGame4Round(round, date);

    setLoading(false);

    if (!res.success) {
      alert("เกิดข้อผิดพลาดในการบันทึกผลรางวัล");
      return;
    }

    setResultModal({
      round,
      date,
      winners: res.winners,
    });

    await loadData();
  };

  // -------------------------------
  // สุ่มผู้ชนะ Final หากทั้ง 5 รอบไม่เจอผู้ชนะ
  // -------------------------------
  const handleFinalRandom = async () => {
    setLoading(true);
    await delay(3000);
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับ
          </button>

          <h2 style={{ color: "white", marginLeft: "20px" }}>
            🎂 Game 4 – Birthday Reward
          </h2>
        </div>
      </header>

      <main className="game4-main">
        {/* -------------------------
                    แสดงข้อมูลรอบล่าสุดเท่านั้น
                -------------------------- */}
        {(() => {
          const played = rounds.filter((r) => r.date !== "");
          if (played.length === 0) return null;

          const last = played[played.length - 1];

          const base = 2000;
          const accumulated = base * (last.round - 1);
          const total = accumulated + base;

          return (
            <div className="round-reward-cards">
              <div className="reward-card played">
                <h4>🎯 รอบที่ {last.round}</h4>

                <p>
                  💰 เงินสะสมก่อนรอบนี้ :
                  <b> {accumulated.toLocaleString()} บาท</b>
                </p>

                <p>
                  🎁 เงินรางวัลของรอบนี้ :<b> {base.toLocaleString()} บาท</b>
                </p>

                <p>
                  🏆 รางวัลรวมรอบนี้ :<b> {total.toLocaleString()} บาท</b>
                </p>

                <p className="date-tag">📅 วันที่สุ่ม : {last.date}</p>

                <hr />

                {last.winners.length === 0 ? (
                  <p style={{ color: "red" }}>❌ ไม่มีผู้ได้รับรางวัล</p>
                ) : (
                  <>
                    <h4>🎉 ผู้ได้รับรางวัล</h4>
                    {last.winners.map((w, i) => (
                      <div key={i} className="winner-item">
                        {w.Name} — {w.EmployeeID}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* -------------------------
                    ปุ่มสุ่มวันเกิด 5 รอบ
                -------------------------- */}
        <div className="round-section">
          <h3>🎯 สุ่มวันเกิด 5 ครั้ง</h3>

          <div className="round-grid">
            {rounds.map((r, i) => (
              <button
                key={i}
                className={`round-btn ${
                  isRoundDisabled(i, rounds) ? "disabled" : ""
                }`}
                disabled={isRoundDisabled(i, rounds)}
                onClick={() => handlePlayRound(i)}
              >
                รอบที่ {i + 1}
                <br />
                {r.date ? `🎉 ${r.date}` : "สุ่มเลย"}
              </button>
            ))}
          </div>
        </div>

        {/* -------------------------
                    ปุ่มสุ่มผู้โชคดีสุดท้าย
                -------------------------- */}
        <div className="final-section">
          <h3>🏆 สุ่มพนักงาน (ถ้าไม่มีผู้ชนะครบ 5 รอบ)</h3>

          <button
            className="final-btn"
            disabled={isFinalDisabled(rounds)}
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
            <p>
              วันเกิดที่ออก: <b>{resultModal.date}</b>
            </p>

            {(resultModal?.winners ?? []).length === 0 ? (
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

      {/* Loading Spinner */}
      {loading && (
        <div className="modal-bg">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}
