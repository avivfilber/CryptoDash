export type Price = { id: string; price_usd: number };
export type NewsItem = { id: string; title: string; url: string };
export type Meme = { id: string; title: string; imageUrl: string; link: string };
export type Dashboard = { prices: Price[]; news: NewsItem[]; ai: { id: string; text: string }; meme: Meme };
export type Preferences = { assets: string[]; investorType: string; contentTypes: string[] };
export type User = { id: string; name: string; email: string; preferences: Preferences };