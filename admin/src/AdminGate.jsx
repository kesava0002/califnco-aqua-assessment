import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'keshavamurthy0002@gmail.com';
async function isAdmin(user) { if (!user) return false; if (user.email?.toLowerCase() === ADMIN_EMAIL) return true; try { const profile = await getDoc(doc(db, 'users', user.uid)); return profile.exists() && profile.data().role === 'Admin'; } catch { return false; } }
export default function AdminGate({ children }) {
  const [authorized, setAuthorized] = useState(false), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [showPassword, setShowPassword] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => onAuthStateChanged(auth, user => { isAdmin(user).then(setAuthorized); }), []);
  async function signIn(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      if (!await isAdmin(result.user)) { await signOut(auth); setError('This account is not authorized for the Admin dashboard.'); return; }
      setPassword('');
    } catch (e) { setError(e.code === 'auth/invalid-credential' ? 'Email or password is incorrect.' : e.message || 'Sign-in failed.'); }
    finally { setBusy(false); }
  }
  async function resetPassword() { if (!email.trim()) { setError('Enter your account email first.'); return; } setBusy(true); setError(''); setNotice(''); try { await sendPasswordResetEmail(auth, email.trim().toLowerCase()); setNotice('If this address has an account, a reset link was sent. Check inbox and spam.'); } catch (e) { setError(e.code === 'auth/invalid-email' ? 'Enter a valid email address.' : 'Could not send the reset email. Check the address and try again.'); } finally { setBusy(false); } }
  if (authorized) return <>{children}<button className="admin-signout" onClick={() => signOut(auth)}>Sign out</button></>;
  return <main className="admin-login"><form className="admin-login-card" onSubmit={signIn}><div className="login-mark">c.</div><p className="login-eyebrow">CALIFNCO AQUA</p><h1>Admin sign in</h1><p className="login-copy">Use the authorized Firebase account to open the dashboard.</p><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<div className="admin-password-row"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{error && <p className="login-error" role="alert">{error}</p>}{notice && <p className="login-success" role="status">{notice}</p>}<button className="login-submit" disabled={busy}>{busy ? 'Please wait…' : 'Sign in'}</button><button className="login-reset" type="button" disabled={busy} onClick={resetPassword}>Forgot password?</button><small>Only the authorized admin account can enter.</small></form></main>;
}
