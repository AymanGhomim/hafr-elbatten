import { useState } from 'react';
import { generateClientPDF } from '../utils/generatePDF';
import { CalendarIcon, MoneyIcon, EditIcon, DownloadIcon, LoaderIcon } from './Icons';

const fmtAmount = (n) =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(n);

const fmtDate = (d) =>
  new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(d));

const ClientCard = ({ client, index, onEdit }) => {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePDF = async () => {
    setPdfLoading(true);
    try {
      await generateClientPDF(client);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div
      className="client-card"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Header */}
      <div className="card-head">
        <div className="c-name">{client.name}</div>
        <span className="req-badge">{client.requestNumber}</span>
      </div>

      {/* Info rows */}
      <div className="card-info">
        <div className="info-row">
          <span className="info-label">
            <CalendarIcon /> التاريخ
          </span>
          <span className="info-val">{fmtDate(client.date)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">
            <MoneyIcon /> المبلغ
          </span>
          <span className="info-val amount">{fmtAmount(client.amount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="card-btns">
        <button className="btn-edit" onClick={() => onEdit(client)}>
          <EditIcon /> تعديل
        </button>

        <button className="btn-pdf" onClick={handlePDF} disabled={pdfLoading}>
          {pdfLoading
            ? <><LoaderIcon /> جارٍ التحميل</>
            : <><DownloadIcon /> تحميل PDF</>
          }
        </button>
      </div>
    </div>
  );
};

export default ClientCard;
