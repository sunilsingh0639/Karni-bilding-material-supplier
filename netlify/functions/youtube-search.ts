import type { Handler } from '@netlify/functions';

const API_KEY = process.env.YOUTUBE_API_KEY ?? '';

const ISO_RE = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
function parseDuration(iso: string): string {
  const m = ISO_RE.exec(iso);
  if (!m) return '';
  const h = parseInt(m[1] ?? '0');
  const min = parseInt(m[2] ?? '0');
  const sec = parseInt(m[3] ?? '0');
  const total = h * 3600 + min * 60 + sec;
  const mm = Math.floor(total / 60);
  const ss = (total % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (!API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'YouTube API key not configured.' }) };
  }

  const params = event.queryStringParameters ?? {};
  const videoId = params.videoId;
  const query = params.q;

  try {
    // Single video info lookup
    if (videoId) {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(videoId)}&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) return { statusCode: res.status, headers, body: JSON.stringify({ error: data?.error?.message ?? 'API error' }) };
      const item = data.items?.[0];
      if (!item) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Video not found.' }) };
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          videoId: item.id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
          duration: parseDuration(item.contentDetails?.duration ?? ''),
        }),
      };
    }

    // Search
    if (!query) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing query parameter q or videoId.' }) };

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=12&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (!searchRes.ok) return { statusCode: searchRes.status, headers, body: JSON.stringify({ error: searchData?.error?.message ?? 'Search failed.' }) };

    const videoIds = (searchData.items ?? [])
      .filter((i: { id?: { videoId?: string } }) => i.id?.videoId)
      .map((i: { id: { videoId: string } }) => i.id.videoId)
      .join(',');

    let durations: Record<string, string> = {};
    if (videoIds) {
      const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`;
      const detailRes = await fetch(detailUrl);
      const detailData = await detailRes.json();
      (detailData.items ?? []).forEach((item: { id: string; contentDetails: { duration: string } }) => {
        durations[item.id] = parseDuration(item.contentDetails.duration);
      });
    }

    const results = (searchData.items ?? [])
      .filter((item: { id?: { videoId?: string } }) => item.id?.videoId)
      .map((item: {
        id: { videoId: string };
        snippet: { title: string; channelTitle: string; thumbnails: { medium?: { url: string }; default?: { url: string } }; publishedAt: string };
      }) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
        publishedAt: item.snippet.publishedAt,
        duration: durations[item.id.videoId] ?? '',
      }));

    return { statusCode: 200, headers, body: JSON.stringify({ results }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Music service temporarily unavailable.' }) };
  }
};
