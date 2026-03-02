import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api/api.js'
import Spinner from '../components/Spinner.jsx'

// 4-pointed star logo matching the screenshot
function StarLogo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 2 C20 2 21.5 11 28 14 C34.5 17 38 20 38 20 C38 20 34.5 23 28 26 C21.5 29 20 38 20 38 C20 38 18.5 29 12 26 C5.5 23 2 20 2 20 C2 20 5.5 17 12 14 C18.5 11 20 2 20 2Z"
        fill="#4a7fd4"
        opacity="0.85"
      />
    </svg>
  )
}

// Eye icon for password toggle
function EyeIcon({ open = true }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) { setError('يرجى إدخال اسم المستخدم وكلمة المرور'); return }
    setLoading(true)
    setError('')
    try {
      const data  = await adminLogin(form)
      const token = data.token || data.accessToken || data.access_token || 'authenticated'
      localStorage.setItem('admin_token', token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. تحقق من بياناتك.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Animated background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>

      <div className="page-centered">
        <div className="login-card">
          {/* Logo */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <StarLogo size={38} />
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:17, fontWeight:700, color:'var(--text)', letterSpacing:'0.02em' }}>
                  بوابة خدمات الغرف
                </div>
                <div style={{ fontSize:10, color:'var(--text-muted)', letterSpacing:'0.14em', textTransform:'uppercase' }}>
                  CHAMBERS E-SERVICES PORTAL
                </div>
              </div>
            </div>
          </div>

          {/* Welcome */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <h1 style={{ fontSize:26, fontWeight:700, color:'var(--text)', marginBottom:8 }}>مرحباً بك</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.6 }}>
              يمكنك تسجيل الدخول الآن للبدء في استخدام النظام
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Username */}
            <div style={{ position:'relative' }}>
              <input
                className="form-input"
                placeholder="اسم المستخدم"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                autoComplete="username"
                style={{ paddingRight:46 }}
              />
              <span style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                color:'var(--text-light)', display:'flex', alignItems:'center'
              }}>
                <UserIcon />
              </span>
            </div>

            {/* Password */}
            <div style={{ position:'relative' }}>
              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight:46, paddingLeft:46 }}
              />
              {/* Lock icon right */}
              <span style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                color:'var(--text-light)', display:'flex', alignItems:'center'
              }}>
                <LockIcon />
              </span>
              {/* Eye icon left */}
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer',
                  color:'var(--text-muted)', display:'flex', alignItems:'center', padding:0,
                }}
              >
                <EyeIcon open={showPass} />
              </button>
            </div>

            {/* Forgot */}
            <div style={{ textAlign:'left' }}>
              <a href="#" style={{ fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}
                onMouseEnter={e=>e.target.style.color='var(--blue)'}
                onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Error */}
            {error && (
              <div className="error-banner">
                <span>⚠</span> <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop:4, fontSize:15, padding:'14px' }} disabled={loading}>
              {loading ? <><Spinner size={17} color="#fff" /> جارٍ الدخول…</> : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Verify link */}
          <div style={{ marginTop:18, textAlign:'center' }}>
            <a href="/verify" style={{ fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.color='var(--blue)'}
              onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>
              التحقق من حالة الطلب ←
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
