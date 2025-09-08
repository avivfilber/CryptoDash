const FALLBACK = [
{ id: 'fb1', title: 'Crypto markets mixed as BTC holds key level', url: 'https://www.coindesk.com/' },
{ id: 'fb2', title: 'Layer-2 adoption continues to rise', url: 'https://www.theblock.co/' },
{ id: 'fb3', title: 'Regulatory roundup: what changed this week', url: 'https://cointelegraph.com/' }
];


async function getNews(){
const token = process.env.CRYPTOPANIC_TOKEN;
if (!token) return FALLBACK;
const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${token}&public=true&kind=news`;
try {
const r = await fetch(url);
if (!r.ok) throw new Error('CryptoPanic error');
const j = await r.json();
return (j.results || []).slice(0, 8).map((p)=> ({ id: String(p.id), title: p.title, url: p.url }));
} catch {
return FALLBACK;
}
}
module.exports = { getNews };