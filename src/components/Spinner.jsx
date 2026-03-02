export default function Spinner({ size = 20, color = 'var(--blue)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation:'spin 0.75s linear infinite', flexShrink:0 }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="2.5"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export function PageSpinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 24px', flexDirection:'column', gap:12 }}>
      <Spinner size={38} />
      <span style={{ color:'var(--text-muted)', fontSize:13 }}>جارٍ التحميل…</span>
    </div>
  )
}
