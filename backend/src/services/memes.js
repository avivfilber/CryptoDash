function decode(str){ return str.replace(/&amp;/g,'&'); }


async function getMeme(){
try {
const r = await fetch('https://www.reddit.com/r/cryptomemes/hot.json?limit=20');
const j = await r.json();
const post = (j.data.children||[])
.map(c=>c.data)
.find(p=> (p.post_hint === 'image' || p.preview) && p.url);
if (!post) throw new Error('No image');
const imageUrl = decode((post.preview?.images?.[0]?.source?.url) || post.url);
return { id: String(post.id), title: post.title, imageUrl, link: `https://reddit.com${post.permalink}` };
} catch (e) {
// static fallback
return { id: 'meme-fallback', title: 'When gas fees drop and you ape in', imageUrl: 'https://i.imgur.com/8RKXAIV.jpeg', link: 'https://reddit.com/r/cryptomemes' };
}
}
module.exports = { getMeme };