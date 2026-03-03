import { useState } from "react";
import { generateClientPDF } from "../utils/generatePDF";
import {
  CalendarIcon,
  MoneyIcon,
  EditIcon,
  DownloadIcon,
  LoaderIcon,
} from "./Icons";

const fmtAmount = (n) =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(
    n,
  );

const fmtDate = (d) => {
  if (!d) return "—";
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(d));
};

const STATUS_AR = {
  pending: { label: "قيد الانتظار", cls: "status-pending" },
  approved: { label: "مقبول", cls: "status-approved" },
  rejected: { label: "مرفوض", cls: "status-rejected" },
  in_progress: { label: "جارٍ التنفيذ", cls: "status-progress" },
  inprogress: { label: "جارٍ التنفيذ", cls: "status-progress" },
  completed: { label: "مكتمل", cls: "status-completed" },
};

const ClientCard = ({ client, index, onEdit }) => {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      // Build a compatible object for the PDF generator
      const pdfData = {
        name: client.establishmentName || client.name,
        requestNumber: client.requestNumber,
        unifiedNumber: client.unifiedNumber,
        crNumber: client.commercialRegister || client.crNumber,
        refNumber: client.refNumber || client.requestNumber,
        date: client.createdAt || client.date,
        amount: client.amount,
        bodyText: client.bodyText,
      };
      await generateClientPDF(pdfData);
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const displayName = client.establishmentName || client.name || "—";
  const displayDate = client.createdAt || client.date;
  const statusKey = (client.status || "").toLowerCase().replace(/\s/g, "");
  const statusInfo = STATUS_AR[statusKey] || {
    label: client.status || "—",
    cls: "",
  };

  return (
    <div className="client-card" style={{ animationDelay: `${index * 0.07}s` }}>
      {/* Header */}
      <div className="card-head">
        <div className="c-name">{displayName}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="req-badge">{client.requestNumber || "—"}</span>
          {client.status && (
            <span className={`status-badge ${statusInfo.cls}`}>
              {statusInfo.label}
            </span>
          )}
        </div>
      </div>

      {/* Info rows */}
      <div className="card-info">
        {client.applicantName && (
          <div className="info-row">
            <span className="info-label">مقدم الطلب</span>
            <span className="info-val">{client.applicantName}</span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">
            <CalendarIcon /> التاريخ
          </span>
          <span className="info-val">{fmtDate(displayDate)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">
            <MoneyIcon /> المبلغ
          </span>
          <span className="info-val amount">
            {fmtAmount(client.amount || 0)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="card-btns">
        <button className="btn-edit" onClick={() => onEdit(client)}>
          <EditIcon /> تعديل
        </button>

        <button className="btn-pdf" onClick={handlePDF} disabled={pdfLoading}>
          {pdfLoading ? (
            <>
              <LoaderIcon /> جارٍ التحميل
            </>
          ) : (
            <>
              <DownloadIcon /> تحميل PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
