import React, { useState } from 'react';
const API_KEY = 'AIzaSyDV1QU-44f7Cu4y-_-A_8ht8Wvhz6rSMHQ';
const ADMIN_EMAIL = 'keshavamurthy0002@gmail.com';
export default function AdminGate({ children }) {
  const [authorized, setAuthorized] = useState(false), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function signIn(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), password, returnSecureToken: true }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Sign-in failed.');
      if (String(result.email || '').toLowerCase() !== ADMIN_EMAIL) { setError('This account is not authorized for the Admin dashboard.'); return; }
      setAuthorized(true); setPassword('');
    } catch (e) { setError(e.message === 'INVALID_LOGIN_CREDENTIALS' ? 'Email or password is incorrect.' : e.message); }
    finally { setBusy(false); }
  }
  if (authorized) return <>{children}<button className="admin-signout" onClick={() => setAuthorized(false)}>Sign out</button></>;
  return <main className="admin-login"><form className="admin-login-card" onSubmit={signIn}><div className="login-mark">c.</div><p className="login-eyebrow">CALIFNCO AQUA</p><h1>Admin sign in</h1><p className="login-copy">Use the authorized Firebase account to open the dashboard.</p><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button><small>Only the authorized admin account can enter.</small></form></main>;
}
