// src/pages/Game2.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { playGame2 } from "../api/api_game2";
import "../styles/theme.css";
import "./game2.css";

export default function Game2() {
  const navigate = useNavigate();

  const [digit1, setDigit1] = useState(0);
  const [digit2, setDigit2] = useState(0);
  const [digit3, setDigit3] = useState(0);

  const [spinning, setSpinning] = useState(false);
  const [modalData, setModalData] = useState(null);

 const startSpin = async () => {
    if (spinning) return;
    setSpinning(true);

    let final1 = 0;
    let final2 = 0;
    let final3 = 0;

    let roll1 = setInterval(() => {
        const v = Math.floor(Math.random() * 5); // 0-4
        final1 = v;
        setDigit1(v);
    }, 60);

    let roll2 = setInterval(() => {
        const v = Math.floor(Math.random() * 10);
        final2 = v;
        setDigit2(v);
    }, 60);

    let roll3 = setInterval(() => {
        const v = Math.floor(Math.random() * 10);
        final3 = v;
        setDigit3(v);
    }, 60);

    // ⏳ Stop one by one with longer timing
    setTimeout(() => clearInterval(roll1), 2000); // หลักที่ 1
    setTimeout(() => clearInterval(roll2), 2500); // หลักที่ 2
    setTimeout(() => clearInterval(roll3), 3000); // หลักที่ 3

    // ⏳ Call backend after all rolls stop
    setTimeout(async () => {
        const number = `${final1}${final2}${final3}`;
        console.log("Final number =", number);

        const res = await playGame2(number);

        setModalData({
            success: res.success,
            number,
            data: res.data || null,
            message: res.success
                ? "พบพนักงานที่ถูกรางวัล!"
                : "ไม่พบพนักงาน กรุณาเล่นใหม่",
        });

        setSpinning(false);
    }, 3200); // ส่ง API หลังหมุนครบ
};
  const closeModal = () => setModalData(null);

  return (
    <div className="game2-container">
      {/* HEADER */}
      <header className="header-common">
        <div className="header-content-common">
          <button className="back-btn-common" onClick={() => navigate("/")}>
            <svg
              width="20"
              height="20"
              stroke="currentColor"
              fill="none"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับ
          </button>

          <h2 className="game2-title">🎰 Game 2 – Lucky 3 Digits</h2>
        </div>
      </header>

      {/* SLOT MACHINE */}
      <div className="slot-wrapper">
        <div className="slot-box">{digit1}</div>
        <div className="slot-box">{digit2}</div>
        <div className="slot-box">{digit3}</div>
      </div>

      {/* SPIN BUTTON */}
      <div
   
        className="btn-rondom-wrap"
      >
        <button
          className="btn-primary spin-btn"
          disabled={spinning}
          onClick={startSpin}
        >
          {spinning ? "กำลังสุ่ม..." : "หมุนสุ่มเลข 🎉"}
        </button>
      </div>

      {/* MODAL */}
      {modalData && (
        <div className="modal-bg">
          <div className="modal-box animate-pop">
            <h2>{modalData.success ? "🎉 ผู้โชคดี!" : "❌ ไม่พบพนักงาน"}</h2>

            <p className="modal-number">
              หมายเลขที่ออก: <b>{modalData.number}</b>
            </p>

            {modalData.success && (
              <div className="winner-box">
                <p>
                  <b>ชื่อ:</b> {modalData.data.fname_lname}
                </p>
                <p>
                  <b>รหัส:</b> {modalData.data.employee_id}
                </p>
              </div>
            )}

            {!modalData.success && (
              <p className="modal-fail">{modalData.message}</p>
            )}

            <button className="btn-primary" onClick={closeModal}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
