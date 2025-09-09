import { useState } from 'react';
import api from '../api';

export default function VoteButtons({
  section,
  itemId,
  onVoted
}: {
  section: 'news'|'prices'|'ai'|'meme';
  itemId: string;
  onVoted?: (v: number) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function vote(v:number){
    if (busy) return;
    setBusy(true);
    try {
      await api.post('/vote', { section, itemId, vote: v });
      onVoted?.(v);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button className="btn" onClick={() => vote(1)} disabled={busy}>👍</button>
      <button className="btn" onClick={() => vote(-1)} disabled={busy}>👎</button>
    </div>
  );
}
