import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
import type { User } from '../types';


interface AuthCtx {
user: User | null;
login: (email: string, password: string) => Promise<void>;
signup: (name: string, email: string, password: string) => Promise<void>;
logout: () => void;
}


const Ctx = createContext<AuthCtx>(null!);
export const useAuth = ()=> useContext(Ctx);


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children})=>{
const [user, setUser] = useState<User|null>(null);


useEffect(()=>{ // restore session
const token = localStorage.getItem('token');
if (!token) return;
api.get('/auth/me').then(r=> setUser(r.data)).catch(()=> localStorage.removeItem('token'));
},[]);


async function login(email:string, password:string){
const r = await api.post('/auth/login', { email, password });
localStorage.setItem('token', r.data.token);
setUser(r.data.user);
}
async function signup(name:string, email:string, password:string){
const r = await api.post('/auth/signup', { name, email, password });
localStorage.setItem('token', r.data.token);
setUser(r.data.user);
}
function logout(){ localStorage.removeItem('token'); setUser(null); }


return <Ctx.Provider value={{ user, login, signup, logout }}>{children}</Ctx.Provider>
}