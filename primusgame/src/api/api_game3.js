import axios from "axios";

const BASE = "http://localhost:8080/api/game3";

export async function getGame3Data() {
    return axios.get(`${BASE}/played`).then(res => res.data);
}

export async function playGame3(body) {
    return axios.post(`${BASE}/play`, body).then(res => res.data);
}
