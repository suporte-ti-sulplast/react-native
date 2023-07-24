import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const createSession = async (login, password) => {
    return api.post("/sessions", {login, password});
};