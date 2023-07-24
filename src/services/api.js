import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.0.236:3000",
});

export const createSession = async (login, password) => {
    return api.post("/auth", {login, password})
};

