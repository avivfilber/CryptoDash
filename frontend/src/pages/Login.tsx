import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function setAuthToken(token: string) {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  // אם יש טוקן קיים — טען לכותרות כבר בכניסה
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  }, []);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setError('');
    try {
      interface LoginResponse { token: string }
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      if (data?.token) setAuthToken(data.token);
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn w-full">Login</button>
      </form>
      <p className="text-sm">No account? <Link to="/signup" className="underline">Sign up</Link></p>
    </div>
  );
}
