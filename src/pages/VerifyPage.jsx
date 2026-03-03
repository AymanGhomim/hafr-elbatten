import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyRequest } from "../api";
import { generateClientPDF } from "../utils/generatePDF";

const STATUS_AR = {
  pending: { label: "قيد الانتظار", color: "#f59e0b", bg: "#fef3c7" },
  approved: { label: "مقبول", color: "#16a34a", bg: "#dcfce7" },
  rejected: { label: "مرفوض", color: "#dc2626", bg: "#fee2e2" },
  inprogress: { label: "جارٍ التنفيذ", color: "#2563eb", bg: "#dbeafe" },
  in_progress: { label: "جارٍ التنفيذ", color: "#2563eb", bg: "#dbeafe" },
  completed: { label: "مكتمل", color: "#7c3aed", bg: "#ede9fe" },
};

const fmtDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtAmount = (n) =>
  n != null
    ? new Intl.NumberFormat("ar-SA", {
        style: "currency",
        currency: "SAR",
      }).format(n)
    : null;

export default function VerifyPage() {
  const { refNumber: paramRef } = useParams();
  const [ref, setRef] = useState(paramRef || "");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (paramRef && !verified) {
      handleVerify();
      setVerified(true);
    }
  }, [paramRef]);

  async function handleVerify(e) {
    e?.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const response = await verifyRequest(ref.trim());
      const record = response?.data?.data;
      setResult(record);
    } catch (err) {
      setError(
        err.message || "لم يتم العثور على الطلب. تحقق من الرقم المرجعي.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    if (!result) return;
    setPdfLoading(true);
    try {
      await generateClientPDF({
        name: result.establishmentName || result.name || "—",
        requestNumber: result.requestNumber,
        unifiedNumber: result.unifiedNumber,
        crNumber: result.commercialRegister,
        refNumber: result.refNumber,
        date: result.createdAt || result.date,
        amount: result.amount,
        bodyText: result.bodyText,
      });
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setPdfLoading(false);
    }
  }

  const statusKey = result?.status?.toLowerCase().replace(/\s/g, "");
  const statusInfo = statusKey
    ? STATUS_AR[statusKey] || {
        label: result.status,
        color: "#6b7280",
        bg: "#f3f4f6",
      }
    : null;

  const rows = result
    ? [
        { label: "إسم الغرفة", value: result.chamberName },
        {
          label: "إسم المنشأة",
          value: result.establishmentName || result.name,
        },
        { label: "الرقم الموحد (700)", value: result.unifiedNumber },
        { label: "رقم الطلب", value: result.requestNumber },
        { label: "نوع الطلب", value: result.requestType },
        { label: "إسم مقدم الطلب", value: result.applicantName },
        { label: "تاريخ ووقت إنشاء الطلب", value: fmtDate(result.createdAt) },
        { label: "مبلغ الطلب", value: fmtAmount(result.amount) },
        { label: "تاريخ صلاحية الطلب", value: fmtDate(result.validUntil) },
        { label: "رقم السجل التجاري", value: result.commercialRegister },
      ].filter((r) => r.value)
    : [];

  /* ───────── shared styles ───────── */
  const cardHeader = {
    background: "#517EC2",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const backBtn = {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: 12,
    padding: "4px 12px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        direction: "rtl",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "#517EC2",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(81,126,194,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "6px",
              padding: "4px 8px",
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 8, color: "#517EC2", fontWeight: 700 }}>
              رؤية
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: "#1a1a2e",
                letterSpacing: "-1px",
              }}
            >
              2030
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>
            بوابة خدمات الغرفة
          </span>
          <div
            style={{
              width: 38,
              height: 38,
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(255,255,255,0.4)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                fill="#fff"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ maxWidth: 600, margin: "32px auto", padding: "0 16px" }}>
        {!result ? (
          /* ── Search Card ── */
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={cardHeader}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                التحقق من الوثائق
              </span>
              <button onClick={() => window.history.back()} style={backBtn}>
                العودة
              </button>
            </div>
            <div style={{ padding: "28px 24px" }}>
              <p
                style={{
                  fontSize: 13,
                  color: "#555",
                  marginBottom: 24,
                  lineHeight: 1.7,
                  textAlign: "center",
                }}
              >
                خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونياً عبر بوابة
                خدمات المشتركين. وللتحقق من شهادة الاشتراك الرجاء ادخال الرقم
                المرجعي الخاص بالوثيقة
              </p>
              <form
                onSubmit={handleVerify}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <input
                  value={ref}
                  onChange={(e) => {
                    setRef(e.target.value);
                    setError("");
                  }}
                  placeholder="أدخل الرقم المرجعي..."
                  dir="ltr"
                  style={{
                    border: "1.5px solid #d1d5db",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 14,
                    outline: "none",
                    textAlign: "center",
                    letterSpacing: "0.05em",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#517EC2")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
                {error && (
                  <div
                    style={{
                      background: "#fee2e2",
                      borderRadius: 8,
                      padding: "10px 14px",
                      color: "#dc2626",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    ❌ {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || !ref.trim()}
                  style={{
                    background: loading || !ref.trim() ? "#9db8e0" : "#517EC2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "11px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading || !ref.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "جارٍ البحث..." : "تحقق"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ── Result Card ── */
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={cardHeader}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                التحقق من الوثائق
              </span>
              <button onClick={() => window.history.back()} style={backBtn}>
                العودة
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Rows */}
              {rows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < rows.length - 1 ? "1px solid #f3f4f6" : "none",
                    gap: 12,
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "#6b7280", flexShrink: 0 }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1f2937",
                      textAlign: "left",
                      direction: "ltr",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Status Row */}
              {statusInfo && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    حالة الطلب
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: statusInfo.color,
                      background: statusInfo.bg,
                      padding: "3px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {/* Download PDF */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  style={{
                    flex: 1,
                    background: pdfLoading ? "#9ca3af" : "#1f2937",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "11px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: pdfLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {pdfLoading ? (
                    "جارٍ التحميل..."
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      تحميل PDF
                    </>
                  )}
                </button>

                {/* Verify Again */}
                <button
                  onClick={() => {
                    window.location.href =
                      "https://es.hafrchamber.org.sa/#/DocumentVerify";
                  }}
                  style={{
                    flex: 1,
                    background: "#517EC2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "11px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  التحقق مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 32,
            background: "#517EC2",
            borderRadius: 10,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
              تطوير وتشغيل
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
              عالم الأنظمة والبرامج
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
              World of Systems & Software
            </div>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                fill="#fff"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
