import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PERSONA_PROMPTS = {
  editor: "You are a strict professional video editor with 15+ years experience. Be brutally honest and direct. No sugarcoating.",
  viewer: "You are a sarcastic but genuinely helpful YouTube viewer. Use humor and wit while giving real advice.",
  strategist: "You are a YouTube growth strategist. Focus on algorithm, CTR, retention, and monetization potential.",
  coach: "You are a warm supportive YouTube coach. Find positives first, then suggest improvements gently.",
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { videoData, persona } = req.body;
  if (!videoData || !persona) return res.status(400).json({ error: 'Missing data' });

  const prompt = `${PERSONA_PROMPTS[persona]}

Analyze this REAL YouTube video:
Title: "${videoData.title}"
Channel: "${videoData.channelTitle}" (${videoData.subscriberCount?.toLocaleString()} subscribers, ${videoData.videoCount} videos)
Views: ${videoData.viewCount?.toLocaleString()} | Likes: ${videoData.likeCount?.toLocaleString()} | Comments: ${videoData.commentCount?.toLocaleString()}
Duration: ${videoData.duration}
Tags: ${videoData.tags || 'none'}
Description: "${videoData.description}"

Reply ONLY with valid JSON, no markdown, no explanation:
{
  "score": <0-100>,
  "verdict": "<one punchy sentence summary in persona style>",
  "topFix": "<single most important actionable fix>",
  "thumbnail": {"score":<1-10>,"good":"<specific positive>","bad":"<specific problem>","fix":"<concrete action>"},
  "title": {"score":<1-10>,"good":"<specific positive>","bad":"<specific problem>","fix":"<concrete action>"},
  "retention": {"score":<1-10>,"good":"<specific positive>","bad":"<specific problem>","fix":"<concrete action>"},
  "seo": {"score":<1-10>,"good":"<specific positive>","bad":"<specific problem>","fix":"<concrete action>"},
  "stats": {"score":<1-10>,"good":"<specific positive>","bad":"<specific problem>","fix":"<concrete action>"},
  "channelTrend": "<channel growth assessment based on real numbers>"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
