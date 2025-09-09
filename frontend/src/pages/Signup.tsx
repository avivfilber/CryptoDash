import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function setAuthToken(token: string) {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setError('');
    try {
      // צור משתמש
      await api.post('/auth/signup', { name, email, password });

      // התחבר אוטומטית כדי לקבל טוקן
      const { data }: { data: { token: string } } = await api.post('/auth/login', { email, password });
      if (data?.token) setAuthToken(data.token);

      // המשך לאונבורדינג
      nav('/onboarding');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Create Account</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        </div>
        <button className="btn w-full">Sign Up</button>
      </form>
      <p className="text-sm">Have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  );
}
