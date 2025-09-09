import { useState, useEffect } from "react";
import api from "../api";

const COINS = ["bitcoin", "ethereum", "solana", "cardano"];
const TYPES = ["HODLer", "Day Trader", "NFT Collector", "Yield Farmer"];
const CONTENT = ["Market News", "Charts", "Social", "Fun"];

export default function Onboarding() {
  const [assets, setAssets] = useState<string[]>(["bitcoin", "ethereum"]);
  const [investorType, setInvestorType] = useState(TYPES[0]);
  const [contentTypes, setContentTypes] = useState<string[]>(CONTENT);
  const [saved, setSaved] = useState(false);

  // טען טוקן מקומי אם יש
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  }, []);

  function toggle<T>(arr: T[], x: T) {
    return arr.includes(x) ? arr.filter((i) => i !== x) : [...arr, x];
  }

  async function onSave() {
    try {
      await api.post("/prefs", { assets, investorType, contentTypes });
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  return (
    <div className="card space-y-6">
      <h1 className="text-2xl font-bold">Tell us what you like</h1>
      {/* ...שאר ה־UI כמו שהיה... */}
      <div>
        <div className="label mb-2">Assets you follow</div>
        <div className="flex flex-wrap gap-2">
          {COINS.map((c) => (
            <button
              key={c}
              onClick={() => setAssets(toggle(assets, c))}
              className={`px-3 py-2 rounded-xl border ${
                assets.includes(c) ? "bg-gray-900 text-white" : "bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label mb-2">Investor type</div>
        <div className="flex gap-3 flex-wrap">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input
                type="radio"
                name="itype"
                checked={investorType === t}
                onChange={() => setInvestorType(t)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="label mb-2">Content you want</div>
        <div className="flex gap-3 flex-wrap">
          {CONTENT.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contentTypes.includes(c)}
                onChange={() => setContentTypes(toggle(contentTypes, c))}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onSave} className="btn">Save Preferences</button>
        {saved && <span className="text-green-700">Saved ✔</span>}
      </div>
    </div>
  );
}
