import axios from "axios";

const TOKEN_KEY = "chamber_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: inject token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// ── Response interceptor: handle errors ──────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 → session expired
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
      return Promise.reject(
        new Error("انتهت الجلسة. يرجى تسجيل الدخول مجدداً."),
      );
    }

    // network / timeout errors
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new Error("انتهت مهلة الطلب. تحقق من اتصالك بالإنترنت."),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new Error(
          "تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت أو أن الخادم يعمل.",
        ),
      );
    }

    // server error messages
    const data = error.response.data;
    const message =
      data?.message ||
      data?.error ||
      data?.msg ||
      `خطأ في الخادم (${error.response.status})`;

    return Promise.reject(new Error(message));
  },
);

export default api;
