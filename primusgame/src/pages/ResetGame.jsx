import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetAll } from "../api/resetAPI";
import { admin, players, rewardCountGame1 } from "../constant/varable";
import "./reset.css";

export default function ResetPage() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [allowReset, setAllowReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyAdmin = () => {
    if (id === admin.id && pass === admin.pass) {
      setAllowReset(true);
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleReset = async () => {
    if (!allowReset || loading) return;

    const ok = window.confirm(
      "ยืนยันการรีเซ็ตระบบทั้งหมด?\n- เคลียร์ค่ารางวัล\n- เขียน players ใหม่\n- สร้าง/รีเซ็ตเอกสาร Reward"
    );
    if (!ok) return;

    const payload = {
      admin_id: id,
      admin_pass: pass,
      players,
      rewardCountGame1,
    };

    try {
      setLoading(true);
      const res = await resetAll(payload);
      if (res?.data?.success) {
        alert("รีเซ็ตระบบเรียบร้อยแล้ว!");
      } else {
        alert(res?.data?.msg || "เกิดข้อผิดพลาด");
      }
    } catch (e) {
      console.error(e);
      alert("เกิดข้อผิดพลาดระหว่างรีเซ็ต");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* Toolbar */}
      <header className="reset-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          กลับ
        </button>
        <h1>🛠 Reset System</h1>
      </header>

      {/* Login Card */}
      <div className="card">
        <h2>Admin Login</h2>
        <div className="form-row">
          <label>Admin ID</label>
          <input
            className="form-input"
            placeholder="admin id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={allowReset}
          />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            disabled={allowReset}
          />
        </div>
        <button
          className={`btn-primary ${allowReset ? "btn-disabled" : ""}`}
          onClick={verifyAdmin}
          disabled={allowReset}
        >
          เข้าสู่ระบบ
        </button>
      </div>

      {/* Danger Reset Card */}
      {allowReset && (
        <div className="card danger">
          <h2>รีเซ็ตข้อมูลทั้งหมด</h2>
          <p className="warn">
            คำเตือน: การดำเนินการนี้จะรีเซ็ตข้อมูลรางวัลและผู้เล่นตามค่าเริ่มต้น
          </p>
          <button
            className="btn-danger"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner inline" />
            ) : (
              "RESET SYSTEM"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
