import { useEffect, useState } from 'react';
import { CheckIcon, XCircleIcon, AlertIcon } from './Icons';

const ICONS = {
  success: <CheckIcon />,
  error:   <XCircleIcon />,
  info:    <AlertIcon />,
};

const Toast = ({ message, type = 'success' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2800);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className={`toast ${type}`}>
      <span className="toast-icon">{ICONS[type] ?? ICONS.info}</span>
      {message}
    </div>
  );
};

export default Toast;
