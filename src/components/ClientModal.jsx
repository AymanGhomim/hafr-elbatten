import { useState, useEffect } from "react";
import { createClient, updateClient } from "../api";
import { EditIcon, PlusIcon, SaveIcon, LoaderIcon } from "./Icons";

const TEXT_FIELDS = [
  {
    label: "اسم المنشأة",
    name: "establishmentName",
    type: "text",
    ph: "أدخل اسم المنشأة",
  },
  {
    label: "اسم مقدم الطلب",
    name: "applicantName",
    type: "text",
    ph: "أدخل اسم مقدم الطلب",
  },
  {
    label: "رقم الطلب",
    name: "requestNumber",
    type: "text",
    ph: "REQ-2024-001",
  },
  { label: "نوع الطلب", name: "requestType", type: "text", ph: "تجديد رخصة" },
  {
    label: "الرقم الموحد (700)",
    name: "unifiedNumber",
    type: "text",
    ph: "7001234567",
  },
  {
    label: "السجل التجاري",
    name: "commercialRegister",
    type: "text",
    ph: "1010987654",
  },
  { label: "المبلغ (ر.س)", name: "amount", type: "number", ph: "0.00" },
  { label: "صالح حتى", name: "validUntil", type: "date", ph: "" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "APPROVED", label: "مقبول" },
  { value: "rejected", label: "مرفوض" },
  { value: "in_progress", label: "جارٍ التنفيذ" },
  { value: "completed", label: "مكتمل" },
];

// حقول السيارة التي يكتبها الأدمن
const CAR_FIELDS = [
  { label: "نوع السيارة", name: "carType", ph: "مرسيدس" },
  { label: "موديل السيارة", name: "carModel", ph: "2015" },
  { label: "رقم اللوحة", name: "carPlate", ph: "أ ب ج 1234" },
  { label: "الرقم التسلسلي", name: "carSerial", ph: "WDBRF40J44F..." },
  { label: "اسم المستلم", name: "receiverName", ph: "اسم الشخص المستلم" },
  { label: "رقم هوية المستلم", name: "receiverId", ph: "1020525505" },
  { label: "رقم الحساب البنكي", name: "bankAccount", ph: "SA89800000..." },
  { label: "قيمة التسليم (ر.س)", name: "deliveryAmount", ph: "120000" },
];

const buildBodyText = (form) => {
  const amountWords = form.deliveryAmount
    ? `(${Number(form.deliveryAmount).toLocaleString("ar-SA")})`
    : "(      )";

  return `نفيدكم نحن مؤسسة / ${form.establishmentName || "[اسم المنشأة]"} سجل رقم / ${form.unifiedNumber || "[الرقم الموحد]"}
بأننا نتنازل عن السيارة الموضح بياناتها أدناه:
النوع / ${form.carType || ""}   الموديل / ${form.carModel || ""}
رقم اللوحة / ${form.carPlate || ""}
الرقم التسلسلي / ${form.carSerial || ""}
لمعرض الصليبيخ للشاحنات كما نفوضه بنقل ملكية السيارة والتوقيع نيابة عنا وإنهاء الإجراءات المتعلقة بذلك.
ويتم تسليم القيمة ${amountWords} فقط وقدره :
إلى السيد / ${form.receiverName || form.applicantName || ""}
رقم الهوية / ${form.receiverId || ""}
رقم الحساب البنكي / ${form.bankAccount || ""}`;
};

const ClientModal = ({ client, onClose, onSave }) => {
  const isEdit = !!client;

  const [form, setForm] = useState({
    establishmentName: client?.establishmentName || "",
    applicantName: client?.applicantName || "",
    requestNumber: client?.requestNumber || "",
    requestType: client?.requestType || "",
    unifiedNumber: client?.unifiedNumber || "",
    commercialRegister: client?.commercialRegister || "",
    amount: client?.amount || "",
    validUntil: client?.validUntil ? client.validUntil.split("T")[0] : "",
    status: client?.status || "pending",
    bodyText: client?.bodyText || "",
    // حقول السيارة
    carType: client?.carType || "",
    carModel: client?.carModel || "",
    carPlate: client?.carPlate || "",
    carSerial: client?.carSerial || "",
    receiverName: client?.receiverName || "",
    receiverId: client?.receiverId || "",
    bankAccount: client?.bankAccount || "",
    deliveryAmount: client?.deliveryAmount || "",
  });

  const [autoBody, setAutoBody] = useState(true);
  const [saving, setSaving] = useState(false);

  // كلما تغيرت الحقول → حدّث bodyText تلقائياً
  useEffect(() => {
    if (autoBody) {
      setForm((prev) => ({ ...prev, bodyText: buildBodyText(prev) }));
    }
  }, [
    autoBody,
    form.establishmentName,
    form.unifiedNumber,
    form.applicantName,
    form.carType,
    form.carModel,
    form.carPlate,
    form.carSerial,
    form.receiverName,
    form.receiverId,
    form.bankAccount,
    form.deliveryAmount,
  ]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBodyChange = (e) => {
    setAutoBody(false); // الأدمن يعدل يدوياً
    setForm((prev) => ({ ...prev, bodyText: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.establishmentName || !form.requestNumber) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: form.amount ? parseFloat(form.amount) : 0,
        validUntil: form.validUntil
          ? new Date(form.validUntil).toISOString()
          : undefined,
      };
      if (isEdit) await updateClient(client._id || client.id, payload);
      else await createClient(payload);
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
            {isEdit ? "تعديل بيانات الطلب" : "إضافة طلب جديد"}
          </h2>
          <button className="modal-x" onClick={onClose} aria-label="إغلاق">
            ×
          </button>
        </div>

        {/* ── بيانات المنشأة ── */}
        <div className="m-section-title">بيانات المنشأة</div>
        <div className="modal-grid">
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

          <div className="m-group">
            <label className="m-label">الحالة</label>
            <select
              className="m-input"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── بيانات السيارة ── */}
        <div className="m-section-title" style={{ marginTop: "16px" }}>
          بيانات السيارة والتنازل
        </div>
        <div className="modal-grid">
          {CAR_FIELDS.map((f) => (
            <div className="m-group" key={f.name}>
              <label className="m-label">{f.label}</label>
              <input
                className="m-input"
                type="text"
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.ph}
              />
            </div>
          ))}
        </div>

        {/* ── نص الوثيقة (معاينة / تعديل يدوي) ── */}
        <div className="m-group m-group-full" style={{ marginTop: "16px" }}>
          <label
            className="m-label"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              نص الوثيقة
              <span className="m-label-hint">
                {" "}
                — يُولَّد تلقائياً من البيانات أعلاه
              </span>
            </span>
            {!autoBody && (
              <button
                type="button"
                onClick={() => setAutoBody(true)}
                style={{
                  fontSize: "11px",
                  padding: "3px 10px",
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ↺ إعادة التوليد التلقائي
              </button>
            )}
          </label>
          <textarea
            className="m-textarea"
            name="bodyText"
            value={form.bodyText}
            onChange={handleBodyChange}
            rows={9}
            style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.9 }}
          />
          {!autoBody && (
            <div
              style={{
                fontSize: "11px",
                color: "#f59e0b",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              ⚠ أنت تعدّل النص يدوياً — التغييرات في الحقول لن تؤثر عليه
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn-save" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <LoaderIcon /> جارٍ الحفظ...
              </>
            ) : isEdit ? (
              <>
                <SaveIcon /> حفظ التعديلات
              </>
            ) : (
              <>
                <PlusIcon /> إضافة الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;
