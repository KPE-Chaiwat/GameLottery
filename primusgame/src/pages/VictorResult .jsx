import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";
import "./victor.css";

import { getConclude } from "../api/api_conclude"; // ← ใช้ API ใหม่

export default function VictorResult() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // โหลดข้อมูลสรุปจาก backend
  // -----------------------------------------
  const loadConclude = async () => {
    setLoading(true);

    const res = await getConclude();

    if (!res.success) {
      alert("ไม่สามารถโหลดข้อมูลสรุปได้");
      setLoading(false);
      return;
    }

    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadConclude();
  }, []);

  if (loading) {
    return (
      <div className="victor-container">
        <div className="modal-bg">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const game1 = data.game1;
  const game2 = data.game2;
  const game3 = data.game3;
  const game4 = data.game4;

  return (
    <div className="victor-container">

      {/* Header */}
      <header className="header-common">
        <div className="header-content-common">
          <button className="back-btn-common" onClick={() => navigate("/")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>กลับ</span>
          </button>

          <h2 style={{ color: "white", marginLeft: "20px" }}>
            📊 สรุปผลรางวัลทั้งหมด
          </h2>
        </div>
      </header>

      {/* MAIN */}
      <main className="victor-main">

        {/* EMPTY */}
        {!data ? (
          <div className="victor-empty-state">
            <h2>ไม่มีข้อมูลสรุป</h2>
            <p>ยังไม่มีการเล่นเกมเลย</p>
          </div>
        ) : (
          <div className="victor-result-section">

            {/* GAME 1 */}
           {/* Game 1 */}
<Game1Table game1={data?.game1??[]} />

            {/* GAME 2 */}
            <section className="victor-section">
              <div className="victor-section-header">
                <h3>🎮 Game 2 — ทะเบียนรถนำโชค</h3>
              </div>

              <div className="victor-game-cards">
                {(game2??[]).length > 0 ? (
                  game2.map((w, i) => (
                    <div key={i} className="victor-game-card has-reward">
                      <h4>{w.Name} — {w.EmployeeID}</h4>
                      <p>🎯 หมายเลขตรงกัน: {w.MatchedNum}</p>
                    </div>
                  ))
                ) : (
                  <div className="victor-game-card no-reward">
                    ไม่มีผู้ชนะ
                  </div>
                )}
              </div>
            </section>

            {/* GAME 3 */}
            <section className="victor-section">
              <div className="victor-section-header">
                <h3>🎮 Game 3 — ตัวเลข 3 หลัก</h3>
              </div>

              <div className="victor-game-cards">
                {(game3?.playersWin??[])?.length > 0 ? (
                  game3.playersWin.map((w, i) => (
                    <div key={i} className="victor-game-card has-reward">
                      <h4>{w.Name} — {w.EmployeeID}</h4>
                      <p>🎯 ตัวเลขที่ตรงกัน: {w.Matched}</p>
                    </div>
                  ))
                ) : (
                  <div className="victor-game-card no-reward">
                    ไม่มีผู้ชนะ
                  </div>
                )}
              </div>
            </section>

            {/* GAME 4 */}
            <section className="victor-section">
              <div className="victor-section-header">
                <h3>🎮 Game 4 — Birthday Jackpot</h3>
              </div>

              <div className="victor-game-cards">
                {game4.rounds.map((r, i) => (
                  <div key={i} className="victor-game-card">
                    <h4>รอบที่ {r.round} — {r.date || "ยังไม่สุ่ม"}</h4>

                    {r.winners.length === 0 ? (
                      <p className="victor-reward-none">ไม่มีผู้ชนะ</p>
                    ) : (
                      r.winners.map((w, j) => (
                        <div key={j} className="victor-user-line">
                          {w.Name} — {w.EmployeeID} (รับ {w.Reward} บาท)
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        )}
      </main>

      <footer className="footer-common">
        <p>© 2025 Victor Conclude System</p>
      </footer>
    </div>
  );
}



function Game1Table({ game1 }) {
    if (!game1) return null;

    const groups = [
        { label: "🏆 ผู้ได้รับรางวัล 500 บาท", items: game1.winner500 },
        { label: "🥉 ผู้ได้รับรางวัล 300 บาท", items: game1.winner300 },
        { label: "🎁 ผู้ได้รับรางวัล 100 บาท", items: game1.winner100 },
    ];

    return (
        <div className="victor-section">
            <div className="victor-section-header">
                <h3>🎯 Game 1 – Lucky Reward</h3>
            </div>

            {groups.map((g, idx) => (
                <div key={idx} className="game1-table-block">
                    <h4 className="game1-table-title">{g.label}</h4>

                    {(!g.items || g.items.length === 0) ? (
                        <p className="game1-empty">— ไม่มีผู้ได้รับรางวัล —</p>
                    ) : (
                        <table className="game1-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>ชื่อ – นามสกุล</th>
                                    <th>เวลา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {g.items.map((w, i) => (
                                    <tr key={i}>
                                        <td>{w.EmployeeID}</td>
                                        <td>{w.Name}</td>
                                        <td>{new Date(w.Time).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    );
}
