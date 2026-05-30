export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });

  const YT_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const [videoRes, ] = await Promise.all([
      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics,contentDetails&key=${YT_KEY}`)
    ]);

    const videoData = await videoRes.json();
    if (videoData.error) return res.status(400).json({ error: videoData.error.message });
    if (!videoData.items?.length) return res.status(404).json({ error: 'Video not found' });

    const item = videoData.items[0];
    const channelId = item.snippet.channelId;

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=statistics,snippet&key=${YT_KEY}`
    );
    const channelData = await channelRes.json();
    const ch = channelData.items?.[0];

    return res.status(200).json({
      title: item.snippet.title,
      description: item.snippet.description?.slice(0, 500) || '',
      tags: (item.snippet.tags || []).slice(0, 10).join(', '),
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount || 0),
      likeCount: parseInt(item.statistics.likeCount || 0),
      commentCount: parseInt(item.statistics.commentCount || 0),
      thumbnail: item.snippet.thumbnails?.high?.url || '',
      subscriberCount: parseInt(ch?.statistics?.subscriberCount || 0),
      videoCount: parseInt(ch?.statistics?.videoCount || 0),
      totalViews: parseInt(ch?.statistics?.viewCount || 0),
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
