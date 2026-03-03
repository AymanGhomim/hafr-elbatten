// ─── Auth Service ────────────────────────────────────────────────
import api from "./axiosInstance";

const TOKEN_KEY = "chamber_token";

/**
 * تسجيل الدخول
 * POST /api/admin/login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 */
export async function login(username, password) {
  return api.post("/api/admin/login", { username, password });
}

/**
 * تسجيل الخروج (مسح التوكن)
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * جلب التوكن المحفوظ
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * حفظ التوكن
 */
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
