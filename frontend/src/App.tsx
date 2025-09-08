import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Dashboard from "./pages/Dashboard.tsx";



function Protected({ children }: { children: React.ReactNode }){
const { user } = useAuth();
if (!user) return <Navigate to="/login" replace />;
return children;
}


export default function App(){
const { user, logout } = useAuth();
return (
<div className="max-w-5xl mx-auto p-6 space-y-6">
<header className="flex items-center justify-between">
<Link to="/" className="text-2xl font-bold">CryptoDash</Link>
<nav className="space-x-3">
{user ? (
<>
<Link className="underline" to="/onboarding">Preferences</Link>
<button className="btn" onClick={logout}>Logout</button>
</>
) : (
<>
<Link className="btn" to="/login">Login</Link>
<Link className="btn" to="/signup">Sign Up</Link>
</>
)}
</nav>
</header>


<Routes>
<Route path="/" element={<Protected><Dashboard /></Protected>} />
<Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="*" element={<Navigate to="/" />} />
</Routes>
</div>
);
}