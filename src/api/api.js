const BASE_URL = 'https://chamber-requests-backend.vercel.app'

function getToken() {
  return localStorage.getItem('admin_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// ── Fetch wrapper with timeout + clear Arabic error messages ──────
async function apiFetch(url, options = {}) {
  const controller = new AbortController()
  const timeoutId  = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
    })
    clearTimeout(timeoutId)
    return await handleResponse(res)
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      throw new Error('انتهت مهلة الطلب. تحقق من اتصالك بالإنترنت.')
    }
    if (
      err.message === 'Failed to fetch' ||
      err.message.includes('NetworkError') ||
      err.message.includes('network') ||
      err.message.includes('fetch')
    ) {
      throw new Error('تعذّر الاتصال بالخادم. تأكد من اتصالك بالإنترنت أو أن الخادم يعمل.')
    }
    throw err
  }
}

async function handleResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/login'
    throw new Error('انتهت الجلسة. يرجى تسجيل الدخول مجدداً.')
  }

  let data
  try {
    const text = await res.text()
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error   ||
      data?.msg     ||
      `خطأ في الخادم (${res.status})`
    throw new Error(message)
  }

  return data
}

// ── Auth ─────────────────────────────────────────────────────────
export async function adminLogin({ username, password }) {
  return apiFetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

// ── Requests ──────────────────────────────────────────────────────
export async function getRequests(params = {}) {
  const cleaned = Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  const query   = new URLSearchParams(cleaned).toString()
  const url     = `${BASE_URL}/api/admin/requests${query ? `?${query}` : ''}`
  return apiFetch(url, { headers: authHeaders() })
}

export async function getRequest(id) {
  return apiFetch(`${BASE_URL}/api/admin/requests/${id}`, { headers: authHeaders() })
}

export async function createRequest(data) {
  return apiFetch(`${BASE_URL}/api/admin/request`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export async function updateRequest(id, data) {
  return apiFetch(`${BASE_URL}/api/admin/requests/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
}

export async function deleteRequest(id) {
  return apiFetch(`${BASE_URL}/api/admin/requests/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

// ── User Verify ───────────────────────────────────────────────────
export async function verifyRequest(refNumber) {
  return apiFetch(`${BASE_URL}/api/user/verify/${encodeURIComponent(refNumber)}`)
}
