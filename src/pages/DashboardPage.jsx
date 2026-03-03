import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../api";
import StarIcon from "../components/StarIcon";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import ClientCard from "../components/ClientCard";
import ClientModal from "../components/ClientModal";
import {
  LogoutIcon,
  PlusIcon,
  UsersIcon,
  ClipboardIcon,
} from "../components/Icons";

const DashboardPage = ({ token, onLogout }) => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getClients();
      console.log("clients response", res); // ← شوف الـ structure
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.requests)
              ? res.requests
              : Array.isArray(res?.data?.requests)
                ? res.data.requests
                : [];
      setClients(data);
    } catch {
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleDelete = (id) => {
    setClients((prev) => prev.filter((c) => (c._id || c.id) !== id));
    showToast("تم حذف الطلب بنجاح", "success");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleSave = async () => {
    const message =
      modal && modal !== "create"
        ? "تم تعديل البيانات بنجاح"
        : "تم إضافة العميل بنجاح";
    setModal(null);
    showToast(message, "success");
    await loadClients();
  };

  return (
    <div className="dashboard">
      <div className="dash-dot" />

      {/* ─── Header ─── */}
      <header className="header">
        <div className="hdr-brand">
          <StarIcon size={24} />
          <div>
            <div className="brand-name">بوابة خدمات الغرف</div>
            <span className="brand-sub">Chambers E-Services Portal</span>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <LogoutIcon />
          تسجيل الخروج
        </button>
      </header>

      {/* ─── Main Content ─── */}
      <div className="dash-content">
        {/* Toolbar */}
        <div className="dash-toolbar">
          <div className="toolbar-left">
            <div className="toolbar-icon-wrap">
              <UsersIcon />
            </div>
            <div>
              <div className="dash-title">قائمة العملاء</div>
              <div className="dash-sub">
                {loading
                  ? "جارٍ التحميل..."
                  : `${clients.length} عميل مسجّل في النظام`}
              </div>
            </div>
          </div>

          <button className="btn-create" onClick={() => setModal("create")}>
            <PlusIcon />
            إضافة عميل
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <Spinner label="جارٍ تحميل بيانات العملاء..." />
        ) : clients.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <ClipboardIcon />
            </div>
            <p>لا يوجد عملاء مسجلون حتى الآن</p>
          </div>
        ) : (
          <div className="cards-grid">
            {clients.map((client, i) => (
              <ClientCard
                key={client._id || client.id}
                client={client}
                index={i}
                onEdit={setModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <ClientModal
          client={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default DashboardPage;
