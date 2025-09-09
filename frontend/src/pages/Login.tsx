import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function setAuthToken(token: string) {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
      if (data?.token) setAuthToken(data.token);
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-600" aria-live="polite">{error}</p>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required aria-invalid={!!error}/>
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required aria-invalid={!!error}/>
        </div>
        <button className="btn w-full" disabled={busy}>{busy ? '...' : 'Login'}</button>
      </form>
      <p className="text-sm">No account? <Link to="/signup" className="underline">Sign up</Link></p>
    </div>
  );
}
