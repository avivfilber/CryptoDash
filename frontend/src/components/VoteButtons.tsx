import api from '../api';


export default function VoteButtons({ section, itemId }: { section: 'news'|'prices'|'ai'|'meme'; itemId: string }){
async function vote(up:boolean){ await api.post('/vote', { section, itemId, up }).catch(()=>{}); }
return (
<div className="flex items-center gap-2">
<button aria-label="thumbs up" className="px-3 py-1 rounded-lg bg-green-600 text-white" onClick={()=>vote(true)}>👍</button>
<button aria-label="thumbs down" className="px-3 py-1 rounded-lg bg-red-600 text-white" onClick={()=>vote(false)}>👎</button>
</div>
);
}