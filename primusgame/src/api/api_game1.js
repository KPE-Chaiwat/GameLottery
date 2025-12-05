// src/api/api.js

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/game1",
    headers: {
        "Content-Type": "application/json",
    },
});

// -----------------------------------
// GET: Player by EmployeeID
// -----------------------------------
export async function getPlayer(employeeID) {
    try {
        const res = await api.get(`/player/${employeeID}`);
        return res.data; // axios ใช้ data
    } catch (error) {
        console.error("API ERROR getPlayer:", error);
        return { status: "error", msg: "api error" };
    }
}

// -----------------------------------
// GET: reward status
// -----------------------------------
export async function getRewardStatus() {
    try {
        const res = await api.get("/reward");
        return res.data;
    } catch (error) {
        console.error("API ERROR getRewardStatus:", error);
        return { status: "error", msg: "api error" };
    }
}

// -----------------------------------
// POST: update player game1 result
// -----------------------------------
export async function updatePlayerResult(payload) {
    try {
        console.log("update player in api_game1.js :", payload.employee_id);
        const res = await api.post(`/player/update`, payload);
        return res.data;
    } catch (error) {
        console.error("API ERROR updatePlayerResult:", error);
        return { status: "error", msg: "api error" };
    }
}

// -----------------------------------
// POST: decrease reward count
// -----------------------------------
export async function updateRewardCount(type) {
    try {
        console.log("update reward type :", type);

        const res = await api.post(`/reward/update`, { type });
        return res.data;
    } catch (error) {
        console.error("API ERROR updateRewardCount:", error);
        return { status: "error", msg: "api error" };
    }
}
