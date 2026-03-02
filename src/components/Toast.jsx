import { useState, useCallback, useEffect, createContext, useContext } from 'react'
import { CheckCircleIcon, XCircleIcon, AlertIcon, XIcon } from './Icons.jsx'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type, exiting: false }])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 300)
  }, [])

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error', dur),
    warning: (msg, dur) => add(msg, 'warning', dur),
    info:    (msg, dur) => add(msg, 'info', dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }) {
  const icons = {
    success: <CheckCircleIcon size={16} />,
    error:   <XCircleIcon size={16} />,
    warning: <AlertIcon size={16} />,
    info:    <AlertIcon size={16} />,
  }

  return (
    <div className={`toast toast-${toast.type} ${toast.exiting ? 'exiting' : 'entering'}`}>
      {icons[toast.type]}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          opacity: 0.6,
          display: 'flex',
          padding: 2,
        }}
      >
        <XIcon size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
