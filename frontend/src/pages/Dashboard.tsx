import { useEffect, useState } from "react";
import api from "../api";
import VoteButtons from "../components/VoteButtons";

type Price = { id: string; price_usd: number };
type NewsItem = { id: string; title: string; url: string };
type Meme = { id: string; title: string; imageUrl: string; link: string };
type DashboardData = {
  prices: Price[];
  news: NewsItem[];
  ai: { id: string; text: string };
  meme: Meme;
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  }, []);

  async function load() {
    setLoading(true);
    const r = await api.get("/dashboard").catch(()=>({ data: null as any }));
    setData(r.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className="card">Loading...</p>;
  if (!data) return <p className="card">No data.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ...כמו אצלך... */}
      <button onClick={load} className="btn md:col-span-2">Refresh Dashboard</button>
    </div>
  );
}
