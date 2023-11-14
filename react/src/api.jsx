import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("TOKEN") || "";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (err) => {
        try {
            const { response } = err;
            if (response.status === 401) {
                localStorage.removeItem("TOKEN");
            }
            return response;
        } catch (e) {
            return e;
        }
    }
);

export default api;
