import { useState } from "react";
import { generateClientPDF } from "../utils/generatePDF";
import { deleteClient } from "../api";
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

const ClientCard = ({ client, index, onEdit, onDelete }) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await generateClientPDF({
        name: client.establishmentName || client.name,
        requestNumber: client.requestNumber,
        unifiedNumber: client.unifiedNumber,
        crNumber: client.commercialRegister || client.crNumber,
        refNumber: client.refNumber || client.requestNumber,
        date: client.createdAt || client.date,
        amount: client.amount,
        bodyText: client.bodyText,
      });
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteClient(client._id || client.id);
      onDelete(client._id || client.id);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
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
              <DownloadIcon /> PDF
            </>
          )}
        </button>

        {/* Delete Button */}
        {confirmDelete ? (
          <div style={{ display: "flex", gap: 4, flex: 1 }}>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              style={{
                flex: 1,
                padding: "8px 4px",
                border: "none",
                borderRadius: 8,
                background: "#dc2626",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: deleteLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {deleteLoading ? (
                <>
                  <LoaderIcon /> جارٍ...
                </>
              ) : (
                "✓ تأكيد"
              )}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                flex: 1,
                padding: "8px 4px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                background: "#fff",
                color: "#374151",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✕ إلغاء
            </button>
          </div>
        ) : (
          <button
            className="btn-delete"
            onClick={handleDelete}
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 8,
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fecaca")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fee2e2")}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            حذف
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
