async function getPrices(assets = ['bitcoin','ethereum']){
const ids = Array.from(new Set(assets)).join(',');
const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
const r = await fetch(url);
if (!r.ok) throw new Error('CoinGecko error');
const data = await r.json();
const list = Object.entries(data).map(([id, obj])=> ({ id, price_usd: obj.usd }));
return list;
}
module.exports = { getPrices };