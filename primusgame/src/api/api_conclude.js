import axios from "axios";
const BASE = "http://localhost:8080/api";

export const getConclude = async () => {
    try {
        const res = await axios.get(`${BASE}/conclude`);
        return {
            success: true,
            data: res.data.data || null,
        };
    } catch (err) {
        console.error("❌ API ERROR: getConclude()", err);

        return {
            success: false,
            msg: err.response?.data?.msg || "Cannot fetch conclude data",
            error: err,
        };
    }
};
