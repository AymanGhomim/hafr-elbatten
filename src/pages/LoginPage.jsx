import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../api/mockAPI';
import StarIcon from '../components/StarIcon';
import { UserIcon, LockIcon, EyeIcon, AlertIcon, LoaderIcon } from '../components/Icons';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    const e = {};
    if (!username.trim())        e.username = 'اسم المستخدم مطلوب';
    if (!password)               e.password = 'كلمة المرور مطلوبة';
    else if (password.length < 6) e.password = 'يجب أن تكون 6 أحرف على الأقل';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { token } = await apiLogin(username, password);
      onLoginSuccess(token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="login-bg">
      <div className="blob blob-tl"  />
      <div className="blob blob-tl2" />
      <div className="blob blob-tr"  />
      <div className="blob blob-bl"  />
      <div className="blob blob-br"  />
      <div className="dot-grid"      />

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <StarIcon size={30} />
          <div>
            <div className="brand-name">بوابة خدمات الغرف</div>
            <span className="brand-sub">Chambers E-Services Portal</span>
          </div>
        </div>

        {/* Welcome */}
        <div className="login-welcome">
          <h1>مرحباً بك</h1>
          <p>يمكنك تسجيل الدخول الآن للبدء في استخدام النظام</p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="api-error">
            <AlertIcon /> {apiError}
          </div>
        )}

        {/* Username */}
        <div className="field-wrap">
          <div className={`input-row ${errors.username ? 'err' : ''}`}>
            <span className="i-icon"><UserIcon /></span>
            <input
              className="form-input"
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
          {errors.username && <div className="field-err">{errors.username}</div>}
        </div>

        {/* Password */}
        <div className="field-wrap">
          <div className={`input-row ${errors.password ? 'err' : ''}`}>
            <span className="i-icon"><LockIcon /></span>
            <input
              className="form-input"
              type={showPass ? 'text' : 'password'}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="i-icon-left"
              type="button"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? 'إخفاء' : 'إظهار'}
            >
              <EyeIcon open={showPass} />
            </button>
          </div>
          {errors.password && <div className="field-err">{errors.password}</div>}
        </div>

        <button className="forgot-btn" type="button">نسيت كلمة المرور؟</button>

        <button className="btn-login" onClick={handleSubmit} disabled={loading}>
          {loading
            ? <span className="btn-loading"><LoaderIcon /> جارٍ التحقق...</span>
            : 'تسجيل الدخول'
          }
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
