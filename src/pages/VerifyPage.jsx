import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { verifyRequest } from "../api";
import { generateClientPDF } from "../utils/generatePDF";

// Hook مخصص للتجاوب
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const STATUS_AR = {
  pending: { label: "قيد الانتظار", color: "#f59e0b" },
  approved: { label: "مقبول", color: "#16a34a" },
  rejected: { label: "مرفوض", color: "#dc2626" },
  inprogress: { label: "جارٍ التنفيذ", color: "#2563eb" },
  in_progress: { label: "جارٍ التنفيذ", color: "#2563eb" },
  completed: { label: "مكتمل", color: "#7c3aed" },
  منتهى: { label: "منتهى", color: "#dc2626" },
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

  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 768px)");

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
    ? STATUS_AR[statusKey] ||
      STATUS_AR[result?.status] || {
        label: result.status,
        color: "#6b7280",
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

  const getContainerMaxWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "90%";
    return "900px";
  };

  const getFontSize = () => {
    if (isMobile) return "12px";
    if (isTablet) return "13px";
    return "14px";
  };

  const getHeaderPadding = () => {
    if (isMobile) return "12px 16px";
    return "14px 20px";
  };

  const cardHeader = {
    color: "#000000",
    padding: getHeaderPadding(),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: "8px",
  };

  const backBtn = {
    background: "#517EC2",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontSize: isMobile ? "11px" : "12px",
    padding: isMobile ? "6px 10px" : "8px 12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const inputStyle = {
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    padding: isMobile ? "12px 16px" : "10px 14px",
    fontSize: getFontSize(),
    outline: "none",
    textAlign: "center",
    letterSpacing: "0.05em",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  };

  const buttonStyle = {
    background: loading || !ref.trim() ? "#9db8e0" : "#517EC2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: isMobile ? "14px" : "11px",
    fontSize: getFontSize(),
    fontWeight: 600,
    cursor: loading || !ref.trim() ? "not-allowed" : "pointer",
    width: "100%",
    transition: "all 0.2s ease",
  };

  // ── الستايلات الجديدة للصفوف ──
  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
    gap: "8px",
    flexDirection: "row", // دايماً أفقي
    lineHeight: 1.5,
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#1f2937", // داكن مثل الصورة
    flexShrink: 0,
    fontWeight: "700",
  };

  const valueStyle = {
    fontSize: "13px",
    fontWeight: 400,
    color: "#1f2937",
    textAlign: "left",
    direction: "ltr",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header Image ── */}
      <header style={{ width: "100%", overflow: "hidden", flexShrink: 0 }}>
        <img
          src="/src/imgs/vheader.jpeg"
          alt="Header"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: isMobile ? "120px" : "auto",
            objectFit: "cover",
            display: "block",
          }}
        />
      </header>

      {/* ── Body ── */}
      <div
        style={{
          maxWidth: getContainerMaxWidth(),
          width: "100%",
          margin: isMobile ? "16px auto" : "32px auto",
          padding: isMobile ? "0 12px" : "0 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!result ? (
          /* ── Search Card ── */
          <div
            style={{
              background: "#fff",
              borderRadius: isMobile ? 8 : 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              flex: 1,
            }}
          >
            <div style={cardHeader}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: isMobile ? "13px" : "14px",
                }}
              >
                التحقق من الوثائق
              </span>
              <button onClick={() => window.history.back()} style={backBtn}>
                العودة
              </button>
            </div>
            <div style={{ height: "1px", background: "#e5e7eb" }}></div>
            <div style={{ padding: isMobile ? "20px 16px" : "28px 24px" }}>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "13px",
                  color: "#555",
                  marginBottom: isMobile ? "16px" : "24px",
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "10px" : "12px",
                }}
              >
                <input
                  value={ref}
                  onChange={(e) => {
                    setRef(e.target.value);
                    setError("");
                  }}
                  placeholder="أدخل الرقم المرجعي..."
                  dir="ltr"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#517EC2")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
                {error && (
                  <div
                    style={{
                      background: "#fee2e2",
                      borderRadius: 8,
                      padding: isMobile ? "8px 12px" : "10px 14px",
                      color: "#dc2626",
                      fontSize: isMobile ? "11px" : "13px",
                      textAlign: "center",
                    }}
                  >
                    ❌ {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading || !ref.trim()}
                  style={buttonStyle}
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
              borderRadius: isMobile ? 8 : 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={cardHeader}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: isMobile ? "13px" : "14px",
                }}
              >
                التحقق من الوثائق
              </span>
              <button onClick={() => window.history.back()} style={backBtn}>
                العودة
              </button>
            </div>

            <div style={{ height: "1px", background: "#e5e7eb" }}></div>

            <div
              style={{ padding: isMobile ? "12px 16px 4px" : "16px 24px 4px" }}
            >
              <p
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: "#555",
                  lineHeight: 1.7,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                خدمة تتيح التحقق من الوثائق التي تم تصديقها إلكترونياً عبر بوابة
                خدمات المشتركين. وللتحقق من شهادة الاشتراك الرجاء ادخال الرقم
                المرجعي الخاص بالوثيقة
              </p>
            </div>

            <div style={{ padding: isMobile ? "12px 16px" : "12px 24px 20px" }}>
              {/* Rows */}
              {rows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    ...rowStyle,
                    borderBottom:
                      i < rows.length - 1
                        ? "1px solid #e5e7eb"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <span style={labelStyle}>{row.label}</span>
                  <span style={valueStyle}>{row.value}</span>
                </div>
              ))}

              {/* Status Row — نص ملوّن بدون badge */}
              {statusInfo && (
                <div style={{ ...rowStyle, borderBottom: "none" }}>
                  <span style={labelStyle}>حالة الطلب</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: statusInfo.color,
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: isMobile ? "8px" : "10px",
                  marginTop: isMobile ? "16px" : "20px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
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
                    padding: isMobile ? "12px" : "11px",
                    fontSize: getFontSize(),
                    fontWeight: 600,
                    cursor: pdfLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                  }}
                >
                  {pdfLoading ? (
                    "جارٍ التحميل..."
                  ) : (
                    <>
                      <svg
                        width={isMobile ? 14 : 16}
                        height={isMobile ? 14 : 16}
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
                    setResult(null);
                    setRef("");
                    setError("");
                  }}
                  style={{
                    flex: 1,
                    background: "#517EC2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: isMobile ? "12px" : "11px",
                    fontSize: getFontSize(),
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  التحقق مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, minHeight: isMobile ? "16px" : "32px" }}></div>
      </div>

      {/* ── Footer Image ── */}
      <footer style={{ width: "100%", height:"50px", flexShrink: 0, marginTop: "auto" }}>
        <img
          src="/src/imgs/vfooter.jpg"
          alt="Footer"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: isMobile ? "100px" : "auto",
            objectFit: "cover",
          }}
        />
      </footer>
    </div>
  );
}
