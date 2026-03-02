import { EditIcon, TrashIcon } from './Icons.jsx'

const STATUS_MAP = {
  pending:     { label:'قيد الانتظار', cls:'badge-pending' },
  approved:    { label:'مقبول',        cls:'badge-approved' },
  rejected:    { label:'مرفوض',        cls:'badge-rejected' },
  inprogress:  { label:'جارٍ التنفيذ', cls:'badge-inprogress' },
  in_progress: { label:'جارٍ التنفيذ', cls:'badge-inprogress' },
  completed:   { label:'مكتمل',        cls:'badge-completed' },
}

function getStatus(raw) {
  if (!raw) return null
  return STATUS_MAP[raw.toLowerCase().replace(/\s/g,'')] || { label:raw, cls:'badge-pending' }
}

function PdfIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

export default function ClientCard({ request, onEdit, onDelete, onPdf }) {
  const status  = getStatus(request.status)
  const name    = request.clientName || request.name || 'عميل'
  const refNum  = request.refNumber  || request._id?.slice(-8)?.toUpperCase() || '—'
  const date    = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })
    : request.date || '—'
  const amount  = request.amount != null
    ? `${Number(request.amount).toLocaleString('ar-EG')} ر.س.`
    : request.total || null

  return (
    <div className="client-card">
      {/* Name + REQ badge */}
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
          <span style={{ fontSize:16, fontWeight:700, color:'var(--text)' }}>{name}</span>
          {status && <span className={`badge ${status.cls}`}>{status.label}</span>}
        </div>
        <span style={{
          display:'inline-block', fontSize:11, fontWeight:600, color:'var(--blue)',
          background:'var(--blue-mist)', padding:'2px 10px', borderRadius:20,
          letterSpacing:'0.05em', alignSelf:'flex-start'
        }}>
          {refNum}
        </span>
      </div>

      {/* Info rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
        <InfoRow label="التاريخ" value={date} />
        {amount  && <InfoRow label="المبلغ" value={amount}  valueColor="#2ecc71" bold />}
        {request.service && <InfoRow label="الخدمة" value={request.service} />}
        {request.phone   && <InfoRow label="الهاتف" value={request.phone} dir="ltr" />}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:10 }}>
        <button
          className="btn btn-outline-green btn-sm"
          style={{ flex:1, gap:6 }}
          onClick={() => onPdf?.(request)}
        >
          <PdfIcon /> PDF
        </button>
        <button
          className="btn btn-primary btn-sm"
          style={{ flex:1 }}
          onClick={() => onEdit?.(request)}
        >
          تعديل
        </button>
        {onDelete && (
          <button className="btn-icon" onClick={() => onDelete?.(request)} title="حذف"
            style={{ color:'#c0392b', borderColor:'rgba(192,57,43,0.2)' }}>
            <TrashIcon size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, value, valueColor, bold, dir }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13 }}>
      <span style={{ color:'var(--text-muted)', fontSize:12 }}>{label}</span>
      <span style={{
        color: valueColor || 'var(--text)',
        fontWeight: bold ? 600 : 400,
        direction: dir,
        textAlign: dir === 'ltr' ? 'left' : 'right',
      }}>{value}</span>
    </div>
  )
}
