import { useState, useEffect } from 'react'
import { XIcon, UserIcon, PhoneIcon, MailIcon, HashIcon } from './Icons.jsx'
import Spinner from './Spinner.jsx'

const SERVICES = [
  'طلب مرافق',
  'طلب خدمة طبية',
  'طلب نقل',
  'خدمة تنظيم فعالية',
  'خدمة استشارية',
  'أخرى',
]

const STATUSES = [
  { value: 'pending',     label: 'قيد الانتظار' },
  { value: 'inprogress',  label: 'جارٍ التنفيذ' },
  { value: 'approved',    label: 'مقبول' },
  { value: 'completed',   label: 'مكتمل' },
  { value: 'rejected',    label: 'مرفوض' },
]

export default function ClientModal({ mode = 'add', initialData = null, onClose, onSubmit, loading = false }) {
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    clientName: '',
    phone:      '',
    email:      '',
    service:    SERVICES[0],
    status:     'pending',
    notes:      '',
    ...initialData,
  })

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">
            {isEdit ? 'تعديل الطلب' : 'إضافة طلب جديد'}
          </span>
          <button className="btn-icon" onClick={onClose} disabled={loading}>
            <XIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row: name + phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">اسم العميل *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    placeholder="الاسم الكامل"
                    value={form.clientName}
                    onChange={e => set('clientName', e.target.value)}
                    required
                    style={{ paddingRight: 36 }}
                  />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <UserIcon size={14} />
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    placeholder="05xxxxxxxx"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    style={{ paddingRight: 36 }}
                    dir="ltr"
                  />
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <PhoneIcon size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={{ paddingRight: 36 }}
                  dir="ltr"
                />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <MailIcon size={14} />
                </span>
              </div>
            </div>

            {/* Row: service + status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">نوع الخدمة *</label>
                <select
                  className="form-input"
                  value={form.service}
                  onChange={e => set('service', e.target.value)}
                  required
                >
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">الحالة *</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات</label>
              <textarea
                className="form-input"
                placeholder="أي تفاصيل إضافية..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Spinner size={14} color="#fff" /> جارٍ الحفظ…</> : isEdit ? 'حفظ التعديلات' : 'إضافة الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
