// src/api/resetAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const resetAll = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}/reset/all`, payload);
    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    // ตรวจสอบว่ามี response กลับมาจาก backend หรือไม่
    if (err.response) {
      return {
        success: false,
        status: err.response.status,
        message: err.response.data?.msg || "Server error",
      };
    }

    // กรณี network error เช่น server ไม่ตอบ, CORS, offline
    return {
      success: false,
      status: 0,
      message: "Cannot connect to server",
    };
  }
};
