import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css"; // common styles
import "./victor.css"; // page-specific styles

export default function VictorResult() {
  const navigate = useNavigate();
  const [employeeID, setEmployeeID] = useState("");
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchEmployee = () => {
    if (!employeeID) return alert("กรุณากรอกรหัสพนักงาน");

    setIsSearching(true);
    
    // Mock delay for animation
    setTimeout(() => {
      setResult({
        fname_lname: "นาย ตัวอย่าง คนทดสอบ",
        employee_id: employeeID,
        games: [
          { game: "Game 1", reward: 300, status: "เล่นแล้ว" },
          { game: "Game 2", reward: null, status: "ยังไม่เล่น" },
          { game: "Game 3", reward: 500, status: "เล่นแล้ว" },
        ],
      });
      setIsSearching(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") searchEmployee();
  };

  const totalReward = result?.games.reduce((sum, g) => sum + (g.reward || 0), 0);

  return (
    <div className="victor-container">
      {/* Decorative Background Elements */}
      <div className="victor-bg-pattern"></div>
      <div className="victor-bg-glow"></div>

      {/* Header / Toolbar - ใช้ common classes */}
      <header className="header-common">
        <div className="header-content-common">
          <button className="back-btn-common" onClick={() => navigate("/")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>กลับ</span>
          </button>

          <div className="search-wrapper-common">
            <div className="search-icon-common">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              className="search-input-common"
              placeholder="ค้นหารหัสพนักงาน..."
              value={employeeID}
              onChange={(e) => setEmployeeID(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className={`btn-primary ${isSearching ? 'loading' : ''}`} 
              onClick={searchEmployee}
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="spinner"></span>
              ) : (
                'ค้นหา'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="victor-main">
        {!result ? (
          <div className="victor-empty-state">
            <div className="victor-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>ค้นหาผลรางวัลพนักงาน</h2>
            <p>กรอกรหัสพนักงานเพื่อดูผลการรับรางวัล</p>
          </div>
        ) : (
          <div className="victor-result-section">
            {/* User Info Card */}
            <div className="victor-user-card">
              <div className="victor-user-avatar">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="victor-user-details">
                <h2>{result.fname_lname}</h2>
                <span className="badge-common">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  ID: {result.employee_id}
                </span>
              </div>
              <div className="victor-total-reward">
                <span className="label">รางวัลรวม</span>
                <span className="amount">{totalReward.toLocaleString()} ฿</span>
              </div>
            </div>

            {/* Section Title */}
            <div className="victor-section-header">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                ผลการรับรางวัล
              </h3>
              <span className="victor-game-count">{result.games.length} เกม</span>
            </div>

            {/* Game Cards */}
            <div className="victor-game-cards">
              {result.games.map((g, index) => (
                <div 
                  className={`victor-game-card ${g.reward ? 'has-reward' : 'no-reward'}`} 
                  key={index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="victor-card-header">
                    <div className="victor-game-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <path d="M6 12h.01M18 12h.01"/>
                      </svg>
                    </div>
                    <h4>{g.game}</h4>
                  </div>
                  
                  <div className="victor-card-body">
                    <div className="victor-status-row">
                      <span className="victor-status-label">สถานะ</span>
                      <span className={`victor-status-value ${g.reward ? 'played' : 'not-played'}`}>
                        {g.reward ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4M12 16h.01"/>
                          </svg>
                        )}
                        {g.status}
                      </span>
                    </div>
                    
                    <div className="victor-reward-row">
                      <span className="victor-reward-label">รางวัล</span>
                      {g.reward ? (
                        <span className="victor-reward-value">
                          <span className="victor-reward-amount">{g.reward.toLocaleString()}</span>
                          <span className="victor-reward-currency">บาท</span>
                        </span>
                      ) : (
                        <span className="victor-reward-none">ไม่มีรางวัล</span>
                      )}
                    </div>
                  </div>

                  {g.reward && <div className="victor-card-shine"></div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - ใช้ common class */}
      <footer className="footer-common">
        <p>© 2025 Victor Reward System</p>
      </footer>
    </div>
  );
}