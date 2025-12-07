// api/api_game4.js
import axios from "axios";

const BASE = "http://localhost:8080/api/game4";


// ------------------------------
// 1) GET Game4 Data
// ------------------------------
export async function getGame4Data() {
    try {
        const res = await axios.get(`${BASE}`);
        return res.data; // return object จาก backend
    } catch (err) {
        console.error("❌ getGame4Data error:", err);
        return { success: false, msg: "network error" };
    }
}


// ------------------------------
// 2) Play a round (สุ่มวันเกิด)
// ------------------------------
export async function playGame4Round(round, date) {
    try {
        const res = await axios.post(`${BASE}/round`, { round, date });
        return res.data;
    } catch (err) {
        console.error("❌ playGame4Round error:", err);
        return { success: false, msg: "network error" };
    }
}


// ------------------------------
// 3) Final winner (สุ่มพนักงาน หากไม่มีผู้ชนะเลย)
// ------------------------------
export async function playGame4Final() {
    try {
        const res = await axios.post(`${BASE}/final`);
        return res.data;
    } catch (err) {
        console.error("❌ playGame4Final error:", err);
        return { success: false, msg: "network error" };
    }
}
