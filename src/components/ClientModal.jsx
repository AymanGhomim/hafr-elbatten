import { useState } from 'react';
import { apiCreateClient, apiUpdateClient } from '../api/mockAPI';
import { EditIcon, PlusIcon, SaveIcon, LoaderIcon } from './Icons';

const TEXT_FIELDS = [
  { label: 'اسم المنشأة / العميل', name: 'name',          type: 'text',   ph: 'أدخل اسم العميل أو المنشأة' },
  { label: 'رقم الطلب',            name: 'requestNumber',  type: 'text',   ph: 'REQ-2024-000'               },
  { label: 'الرقم الموحد (700)',   name: 'unifiedNumber',  type: 'text',   ph: '7013113043'                 },
  { label: 'رقم السجل التجاري',   name: 'crNumber',       type: 'text',   ph: '2511003152'                 },
  { label: 'الرقم المرجعي',        name: 'refNumber',      type: 'text',   ph: '11169918'                   },
  { label: 'التاريخ',              name: 'date',           type: 'date',   ph: ''                           },
  { label: 'المبلغ (ر.س)',        name: 'amount',         type: 'number', ph: '0.00'                       },
];

const ClientModal = ({ client, token, onClose, onSave }) => {
  const isEdit = !!client;

  const [form, setForm] = useState({
    name:          client?.name          || '',
    requestNumber: client?.requestNumber || '',
    unifiedNumber: client?.unifiedNumber || '',
    crNumber:      client?.crNumber      || '',
    refNumber:     client?.refNumber     || '',
    date:          client?.date          || '',
    amount:        client?.amount        || '',
    bodyText:      client?.bodyText      || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.requestNumber || !form.date || !form.amount) return;
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEdit) await apiUpdateClient(token, client.id, payload);
      else        await apiCreateClient(token, payload);
      onSave();
    } finally {
      setSaving(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="overlay" onClick={handleBackdrop}>
      <div className="modal modal-wide">
        {/* Header */}
        <div className="modal-head">
          <h2 className="modal-ttl">
            <span className="modal-ttl-icon">
              {isEdit ? <EditIcon /> : <PlusIcon />}
            </span>
            {isEdit ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
          </h2>
          <button className="modal-x" onClick={onClose} aria-label="إغلاق">×</button>
        </div>

        <div className="modal-grid">
          {/* Text inputs */}
          {TEXT_FIELDS.map((f) => (
            <div className="m-group" key={f.name}>
              <label className="m-label">{f.label}</label>
              <input
                className="m-input"
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.ph}
              />
            </div>
          ))}
        </div>

        {/* Body text textarea */}
        <div className="m-group m-group-full">
          <label className="m-label">
            نص الوثيقة
            <span className="m-label-hint">— النص الذي سيظهر في منتصف الوثيقة المُصدَّرة</span>
          </label>
          <textarea
            className="m-textarea"
            name="bodyText"
            value={form.bodyText}
            onChange={handleChange}
            placeholder={`مثال:\nنفيدكم نحن مؤسسة / [اسم المنشأة] بأننا نتنازل عن السيارة الموضح بياناتها أدناه:\nالنوع / مرسيدس الموديل / 2015\n...`}
            rows={7}
          />
        </div>

        {/* Footer */}
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>إلغاء</button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving
              ? <><LoaderIcon /> جارٍ الحفظ...</>
              : isEdit
                ? <><SaveIcon /> حفظ التعديلات</>
                : <><PlusIcon /> إضافة العميل</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
