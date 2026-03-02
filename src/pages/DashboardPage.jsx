import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequests, createRequest, updateRequest, deleteRequest } from '../api/api.js'
import { ToastProvider, useToast } from '../components/Toast.jsx'
import ClientCard from '../components/ClientCard.jsx'
import ClientModal from '../components/ClientModal.jsx'
import Spinner, { PageSpinner } from '../components/Spinner.jsx'
import { XIcon, SearchIcon, RefreshIcon } from '../components/Icons.jsx'

// 4-pointed star logo
function StarLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20 2 C20 2 21.5 11 28 14 C34.5 17 38 20 38 20 C38 20 34.5 23 28 26 C21.5 29 20 38 20 38 C20 38 18.5 29 12 26 C5.5 23 2 20 2 20 C2 20 5.5 17 12 14 C18.5 11 20 2 20 2Z"
        fill="#4a7fd4" opacity="0.85"
      />
    </svg>
  )
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <Dashboard />
    </ToastProvider>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const toast    = useToast()

  const [requests, setRequests]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search,  setSearch]      = useState('')
  const [modal,   setModal]       = useState(null)   // null | 'add' | 'edit' | 'delete' | 'view'
  const [selected, setSelected]   = useState(null)
  const [saving,   setSaving]     = useState(false)

  // ── Fetch ────────────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getRequests()
      const list = Array.isArray(data) ? data : (data.requests || data.data || [])
      setRequests(list)
    } catch (err) {
      toast.error(err.message || 'فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  // ── Filtered ─────────────────────────────────────────────────────
  const filtered = requests.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (r.clientName || r.name || '').toLowerCase().includes(q) ||
      (r.refNumber  || '').toLowerCase().includes(q) ||
      (r.phone      || '').includes(q) ||
      (r.service    || '').toLowerCase().includes(q)
    )
  })

  // ── Handlers ─────────────────────────────────────────────────────
  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/login', { replace: true })
  }

  function openAdd()        { setModal('add');    setSelected(null) }
  function openEdit(req)    { setModal('edit');   setSelected(req) }
  function openDelete(req)  { setModal('delete'); setSelected(req) }
  function openView(req)    { setModal('view');   setSelected(req) }
  function closeModal()     { setModal(null);     setSelected(null) }

  async function handleSave(formData) {
    setSaving(true)
    try {
      if (modal === 'add') {
        await createRequest(formData)
        toast.success('تم إضافة الطلب بنجاح ✓')
      } else if (modal === 'edit') {
        await updateRequest(selected._id || selected.id, formData)
        toast.success('تم تحديث الطلب بنجاح ✓')
      }
      closeModal()
      fetchRequests()
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deleteRequest(selected._id || selected.id)
      toast.success('تم الحذف بنجاح')
      closeModal()
      fetchRequests()
    } catch (err) {
      toast.error(err.message || 'فشل الحذف')
    } finally {
      setSaving(false)
    }
  }

  function handlePdf(req) {
    toast.info('جارٍ إنشاء ملف PDF…')
    // PDF generation hook point
  }

  return (
    <>
      {/* Background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>

      <div className="app-page">
        {/* ── Topbar ─────────────────────────────────────────────── */}
        <nav className="topnav">
          {/* Left: logout */}
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ gap:6 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            تسجيل الخروج
          </button>

          {/* Right: logo */}
          <div className="topnav-logo">
            <div className="topnav-logo-text">
              <span className="topnav-logo-name">بوابة خدمات الغرف</span>
              <span className="topnav-logo-sub">CHAMBERS E-SERVICES PORTAL</span>
            </div>
            <StarLogo size={30} />
          </div>
        </nav>

        {/* ── Content ────────────────────────────────────────────── */}
        <div className="page-content">
          {/* Page header */}
          <div style={{
            display:'flex', alignItems:'flex-start', justifyContent:'space-between',
            marginBottom:28, flexWrap:'wrap', gap:12
          }}>
            {/* Right: title */}
            <div style={{ textAlign:'right' }}>
              <h1 style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:4 }}>
                قائمة العملاء
              </h1>
              <p style={{ fontSize:13, color:'var(--text-muted)' }}>
                {loading ? 'جارٍ التحميل…' : `${requests.length} عميل مسجّل في النظام`}
              </p>
            </div>

            {/* Left: actions */}
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              {/* Search */}
              <div style={{ position:'relative' }}>
                <input
                  style={{
                    background:'var(--white)', border:'1.5px solid var(--border)',
                    borderRadius:'var(--radius-sm)', padding:'9px 40px 9px 14px',
                    fontSize:13, color:'var(--text)', outline:'none', width:210,
                    fontFamily:'inherit',
                    transition:'border-color 0.18s, box-shadow 0.18s',
                  }}
                  placeholder="بحث..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={e => { e.target.style.borderColor='var(--blue)'; e.target.style.boxShadow='0 0 0 3px rgba(74,127,212,0.12)' }}
                  onBlur={e  => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow='none' }}
                />
                <span style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}>
                  <SearchIcon size={15} />
                </span>
              </div>

              <button className="btn btn-ghost btn-sm" onClick={fetchRequests} disabled={loading} title="تحديث">
                <RefreshIcon size={14} />
              </button>

              <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ gap:6 }}>
                <span style={{ fontSize:16, lineHeight:1 }}>+</span>
                إضافة عميل
              </button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <PageSpinner />
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div style={{ fontSize:15, fontWeight:600, color:'var(--text-muted)' }}>
                {search ? 'لا توجد نتائج مطابقة' : 'لا توجد طلبات بعد'}
              </div>
              {!search && (
                <button className="btn btn-primary" style={{ marginTop:8 }} onClick={openAdd}>
                  + إضافة أول عميل
                </button>
              )}
            </div>
          ) : (
            <div className="clients-grid">
              {filtered.map((req, i) => (
                <div key={req._id || req.id || i} style={{ animationDelay:`${i * 0.05}s` }}>
                  <ClientCard
                    request={req}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    onPdf={handlePdf}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}

      {/* Add / Edit */}
      {(modal === 'add' || modal === 'edit') && (
        <ClientModal
          mode={modal}
          initialData={selected}
          onClose={closeModal}
          onSubmit={handleSave}
          loading={saving}
        />
      )}

      {/* Delete confirm */}
      {modal === 'delete' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth:400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ color:'#c0392b' }}>تأكيد الحذف</span>
              <button className="btn-icon" onClick={closeModal}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ color:'var(--text)', lineHeight:1.8 }}>
                هل أنت متأكد من حذف طلب <strong>{selected.clientName || selected.name}</strong>؟
                <br/>
                <span style={{ color:'#c0392b', fontSize:12 }}>لا يمكن التراجع عن هذا الإجراء.</span>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal} disabled={saving}>إلغاء</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? <><Spinner size={14} color="#c0392b" /> جارٍ الحذف…</> : 'تأكيد الحذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
