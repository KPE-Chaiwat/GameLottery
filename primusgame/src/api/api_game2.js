// src/api/api_game2.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/game2";

export async function playGame2(number) {
  try {
    const res = await axios.post(`${BASE_URL}/play`, { number });
    return res.data;
  } catch (err) {
    return { success: false, msg: "server error", err: err + " " };
  }
}
