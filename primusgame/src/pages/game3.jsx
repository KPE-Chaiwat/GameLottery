import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGame3Data, playGame3 } from "../api/api_game3";
import "./game3.css";

export default function Game3() {
  const navigate = useNavigate();

  // ชุดตัวเลข
  const [set1, setSet1] = useState("");
  const [set2, setSet2] = useState("");
  const [set3, setSet3] = useState("");

  // สถานะปุ่มสุ่มแต่ละชุด
  const [done1, setDone1] = useState(false);
  const [done2, setDone2] = useState(false);
  const [done3, setDone3] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [winners, setWinners] = useState([]);

  // โหลดเกมที่เล่นไปแล้ว
  const [history, setHistory] = useState(null);

  const fetchGame3 = async () => {
    const res = await getGame3Data();
    if (res.success && res.data.playersWin.length > 0) {
      setHistory(res.data);
    }
  };

  useEffect(() => {
    fetchGame3();
  }, []);

  // RANDOM FUNCTION
  const random3Digit = (maxFirstDigit = 9) => {
    const d1 = Math.floor(Math.random() * (maxFirstDigit + 1));
    const d2 = Math.floor(Math.random() * 10);
    const d3 = Math.floor(Math.random() * 10);
    const result = `${d1}${d2}${d3}`;
    if (result === "000" || result === "001")
      return random3Digit(maxFirstDigit);
    return result;
  };

  const spinSet1 = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSet1(random3Digit(9));
      if (count > 30) {
        clearInterval(interval);
        setDone1(true);
      }
    }, 80);
  };

  const spinSet2 = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSet2(random3Digit(9));
      if (count > 30) {
        clearInterval(interval);
        setDone2(true);
      }
    }, 80);
  };

  const spinSet3 = () => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSet3(random3Digit(4)); // หลักที่ 3 = 0-4
      if (count > 30) {
        clearInterval(interval);
        setDone3(true);
      }
    }, 80);
  };

  const handleFindWinners = async () => {
    if (!done1 || !done2 || !done3) {
      alert("กรุณาสุ่มให้ครบทั้ง 3 ชุดก่อน");
      return;
    }

    setLoading(true);

    const res = await playGame3({
      set1,
      set2,
      set3,
    });

    setLoading(false);
    setWinners(res.winners || []);
    setModalOpen(true);
  };

  return (
    <div className="game3-container">
      {/* Header / Toolbar เหมือน Game2 */}
      <header className="header-common">
        <div className="header-content-common">
          {/* ปุ่มย้อนหลัง */}
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
            <span>กลับ</span>
          </button>

          {/* ชื่อเกม */}
          <div className="game-title">🎰 Game 3 – Triple Permutation Match</div>
        </div>
      </header>
      {/* ถ้าเคยเล่นแล้ว */}
      {history && (
        <div className="history-box">
          <h3>ผลรางวัลรอบก่อนหน้า</h3>
          <p>
            ชุดที่ 1: <b>{history.number1}</b>
          </p>
          <p>
            ชุดที่ 2: <b>{history.number2}</b>
          </p>
          <p>
            ชุดที่ 3: <b>{history.number3}</b>
          </p>

          <h4>ผู้โชคดี:</h4>
          {history.playersWin.length === 0 && <p>ไม่มีผู้ได้รับรางวัล</p>}

          {history.playersWin.map((p, i) => (
            <div key={i} className="winner-card">
              <p>
                {p.Name} ({p.EmployeeID})
              </p>
            </div>
          ))}

          <p className="note">* เกมนี้เล่นได้ครั้งเดียวต่อปี * </p>
          <button className="back-btn2" onClick={() => navigate("/")}>
            กลับหน้าหลัก
          </button>

          <hr />
        </div>
      )}

      {!history && (
        <>
          {/* RANDOM UI */}
          <div className="random-section">
            <div className="set-box">
              <div className="number-display">{set1 || "***"}</div>
              <button disabled={done1} onClick={spinSet1}>
                🎲 สุ่มชุดที่ 1
              </button>
            </div>

            <div className="set-box">
              <div className="number-display">{set2 || "***"}</div>
              <button disabled={done2} onClick={spinSet2}>
                🎲 สุ่มชุดที่ 2
              </button>
            </div>

            <div className="set-box">
              <div className="number-display">{set3 || "***"}</div>
              <button disabled={done3} onClick={spinSet3}>
                🎲 สุ่มชุดที่ 3
              </button>
            </div>
          </div>

          {/* BUTTON – FIND WINNER */}
          <button
            className="play-btn"
            onClick={handleFindWinners}
            disabled={!done1 || !done2 || !done3 || loading}
          >
            {loading ? "กำลังค้นหาผู้โชคดี..." : "ค้นหาผู้โชคดี 🎉"}
          </button>
        </>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-bg">
          <div className="modal-card">
            <h3>🎉 ผลการออกรางวัล</h3>
            <p>
              ชุดที่ 1: <b>{set1}</b>
            </p>
            <p>
              ชุดที่ 2: <b>{set2}</b>
            </p>
            <p>
              ชุดที่ 3: <b>{set3}</b>
            </p>

            <h4>ผู้ได้รับรางวัล</h4>
            {winners.length === 0 && <p>❌ ไม่มีพนักงานที่ตรงเงื่อนไข</p>}

            {winners.map((p, i) => (
              <div key={i} className="winner-card">
                {p.fname_lname} ({p.employee_id})
              </div>
            ))}

            <button className="close-btn" onClick={() => setModalOpen(false)}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
