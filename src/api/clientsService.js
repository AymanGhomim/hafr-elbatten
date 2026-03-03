// ─── Clients Service ─────────────────────────────────────────────
import api from "./axiosInstance";

/**
 * جلب كل الطلبات
 * GET /api/admin/requests
 * @returns {Promise<Array>}
 */
export async function getClients() {
  return api.get("/api/admin/requests");
}

/**
 * جلب طلب واحد بالـ ID
 * GET /api/admin/requests/:id
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getClientById(id) {
  return api.get(`/api/admin/requests/${id}`);
}

/**
 * إضافة طلب جديد
 * POST /api/admin/requests
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function createClient(data) {
  return api.post("/api/admin/requests", data);
}

/**
 * تعديل طلب
 * PUT /api/admin/requests/:id
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateClient(id, data) {
  return api.put(`/api/admin/requests/${id}`, data);
}

/**
 * حذف طلب
 * DELETE /api/admin/requests/:id
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteClient(id) {
  return api.delete(`/api/admin/requests/${id}`);
}

/**
 * التحقق من حالة طلب بالرقم المرجعي (public)
 * GET /api/user/verify/:refNumber
 * @param {string} refNumber
 * @returns {Promise<Object>}
 */
export async function verifyRequest(refNumber) {
  return api.get(`/api/user/verify/${encodeURIComponent(refNumber)}`);
}
