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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>('');

  async function load() {
    setBusy(true); setErr('');
    try {
      const r = await api.get("/dashboard");
      setData(r.data as DashboardData);
    } catch (e:any) {
      setErr(e?.response?.data?.error || 'Server unavailable');
      setData(null);
    } finally {
      setLoading(false);
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className="card">Loading...</p>;
  if (err) return <p className="card text-red-700">{err}</p>;
  if (!data) return <p className="card">No data.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* דוגמאות להצגה – השאר כפי שבנית */}
      {/* ... */}

      <button onClick={load} className="btn md:col-span-2" disabled={busy}>
        {busy ? 'Refreshing...' : 'Refresh Dashboard'}
      </button>
    </div>
  );
}
