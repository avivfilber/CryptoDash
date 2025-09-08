async function openrouterInsight(prompt){
const key = process.env.OPENROUTER_API_KEY;
if (!key) return null;
const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${key}`
},
body: JSON.stringify({
model: 'openrouter/auto',
messages: [ { role: 'system', content: 'You are a concise crypto investing assistant.' }, { role: 'user', content: prompt } ],
max_tokens: 160
})
});
if (!r.ok) throw new Error('OpenRouter error');
const j = await r.json();
return j.choices?.[0]?.message?.content?.trim() || null;
}


async function huggingfaceInsight(prompt){
const key = process.env.HUGGINGFACE_API_KEY;
if (!key) return null;
const r = await fetch('https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-128k-instruct', {
method: 'POST',
headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 160, temperature: 0.7 } })
});
if (!r.ok) throw new Error('HF error');
const j = await r.json();
const text = Array.isArray(j) ? j[0]?.generated_text : j.generated_text || j?.[0]?.summary_text;
return (text || '').slice(-400).trim();
}


async function getInsight({ name, assets, investorType }){
const prompt = `User: ${name}. Investor type: ${investorType}. Assets: ${assets.join(', ')}. Give a single actionable, non-financial-advice crypto insight for today in 2-3 sentences, focusing on on-chain or market structure signals. Avoid promises.`;
try {
const viaOpenRouter = await openrouterInsight(prompt);
if (viaOpenRouter) return viaOpenRouter;
} catch {}
try {
const viaHF = await huggingfaceInsight(prompt);
if (viaHF) return viaHF;
} catch {}
return 'Consider setting price alerts or DCA rules for your top assets. Review network activity (transactions, active addresses) versus price — divergence can hint at momentum without timing the market. (Educational only)';
}


module.exports = { getInsight };