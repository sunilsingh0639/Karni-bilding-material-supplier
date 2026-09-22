import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import './Login.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      if (authError.message.toLowerCase().includes('invalid')) setError('Invalid email or password. Please try again.');
      else if (authError.message.toLowerCase().includes('network')) setError('Network error. Please check your connection.');
      else setError(authError.message);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="al-page">
      {/* Left branding panel */}
      <div className="al-left">
        <div className="al-brand">
          <div className="al-brand__icon">K</div>
          <div>
            <div className="al-brand__name">Karni Building Material Supplier</div>
            <div className="al-brand__sub">Gaav Parsneu, Churu, Rajasthan</div>
          </div>
        </div>
        <div className="al-hero-text">
          <h1>Manage your<br /><span>business</span><br />with ease.</h1>
          <p>Upload images, manage products, track enquiries and control your website content — all from one place.</p>
        </div>
        <div className="al-features">
          {['Dynamic image & gallery management', 'YouTube music playlist control', 'Real-time enquiry tracking', 'Website content editor'].map(f => (
            <div key={f} className="al-feature">
              <div className="al-feature__dot" />
              <span className="al-feature__text">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login panel */}
      <div className="al-right">
        <div className="al-card">
          <div className="al-card__header">
            <div className="al-card__eyebrow">Admin Access</div>
            <h2 className="al-card__title">Welcome back,<br />Ganveer Singh</h2>
            <p className="al-card__sub">Sign in to manage Karni Building Material Supplier.</p>
          </div>

          {error && (
            <div className="al-error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="al-form">
            <div className="al-field">
              <label htmlFor="al-email">Email Address</label>
              <div className="al-input-wrap">
                <Mail size={16} className="al-input-icon" />
                <input
                  id="al-email" type="email" className="al-input"
                  placeholder="admin@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="email" required
                />
              </div>
            </div>

            <div className="al-field">
              <label htmlFor="al-password">Password</label>
              <div className="al-input-wrap">
                <Lock size={16} className="al-input-icon" />
                <input
                  id="al-password"
                  type={showPw ? 'text' : 'password'}
                  className="al-input"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password" required
                />
                <button type="button" className="al-pw-toggle" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="al-submit" disabled={loading}>
              {loading ? <><span className="al-spinner" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="al-footer">
            Karni Building Material Supplier · Admin Panel
          </div>
        </div>
      </div>
    </div>
  );
}
