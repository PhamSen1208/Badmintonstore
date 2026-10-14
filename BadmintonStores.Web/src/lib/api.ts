import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5006",
    withCredentials: true, //Cho phép gửi cookie
});

export function setAccessToken(accessToken: string | null)
{
    if(accessToken)
    {
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return;
    }

    delete api.defaults.headers.common.Authorization;
}
