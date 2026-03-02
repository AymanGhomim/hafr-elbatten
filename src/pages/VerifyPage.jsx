import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyRequest } from '../api/api.js'
import Spinner from '../components/Spinner.jsx'
import { HashIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, PhoneIcon } from '../components/Icons.jsx'

const STATUS_AR = {
  pending:     { label: 'قيد الانتظار', color: 'var(--warning)' },
  approved:    { label: 'مقبول',        color: 'var(--success)' },
  rejected:    { label: 'مرفوض',        color: 'var(--danger)' },
  inprogress:  { label: 'جارٍ التنفيذ', color: 'var(--info)' },
  in_progress: { label: 'جارٍ التنفيذ', color: 'var(--info)' },
  completed:   { label: 'مكتمل',        color: 'var(--gold)' },
}

export default function VerifyPage() {
  const { refNumber: paramRef } = useParams()
  const navigate = useNavigate()

  const [ref, setRef]         = useState(paramRef || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')

  async function handleVerify(e) {
    e?.preventDefault()
    if (!ref.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const data = await verifyRequest(ref.trim())
      setResult(data)
    } catch (err) {
      setError(err.message || 'لم يتم العثور على الطلب. تحقق من الرقم المرجعي.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = result?.status
    ? STATUS_AR[result.status.toLowerCase().replace(/\s/g, '')] || { label: result.status, color: 'var(--text-secondary)' }
    : null

  const createdAt = result?.createdAt
    ? new Date(result.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    : result?.date || null

  return (
    <div className="page-centered">
      <div className="verify-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            background: 'var(--gold-bg)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <HashIcon size={22} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-primary)', marginBottom: 4 }}>
            التحقق من حالة الطلب
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            أدخل الرقم المرجعي للاطلاع على حالة طلبك
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleVerify} style={{ display: 'flex', gap: 10 }}>
          <input
            className="form-input"
            placeholder="الرقم المرجعي…"
            value={ref}
            onChange={e => { setRef(e.target.value); setResult(null); setError('') }}
            dir="ltr"
            style={{ flex: 1, letterSpacing: '0.08em' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !ref.trim()}
            style={{ flexShrink: 0 }}
          >
            {loading ? <Spinner size={14} color="#0a0808" /> : 'تحقق'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="verify-result error" style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)' }}>
              <XCircleIcon size={16} />
              <strong>لم يتم العثور على الطلب</strong>
            </div>
            <p style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)', paddingRight: 24 }}>
              {error}
            </p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="verify-result success">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', marginBottom: 14 }}>
              <CheckCircleIcon size={16} />
              <strong>تم العثور على الطلب</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Status */}
              {statusInfo && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>الحالة</span>
                  <span style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: statusInfo.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusInfo.color, display: 'inline-block' }} />
                    {statusInfo.label}
                  </span>
                </div>
              )}

              {/* Client Name */}
              {(result.clientName || result.name) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>اسم العميل</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {result.clientName || result.name}
                  </span>
                </div>
              )}

              {/* Service */}
              {result.service && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>نوع الخدمة</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{result.service}</span>
                </div>
              )}

              {/* Ref Number */}
              {result.refNumber && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>الرقم المرجعي</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                    {result.refNumber}
                  </span>
                </div>
              )}

              {/* Date */}
              {createdAt && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>تاريخ الطلب</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CalendarIcon size={11} />
                    {createdAt}
                  </span>
                </div>
              )}

              {/* Notes */}
              {result.notes && (
                <>
                  <div style={{ height: 1, background: 'rgba(34,197,94,0.15)', margin: '4px 0' }} />
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ملاحظات</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.notes}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Back to login */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a
            href="/login"
            style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            → تسجيل الدخول كمسؤول
          </a>
        </div>
      </div>
    </div>
  )
}
