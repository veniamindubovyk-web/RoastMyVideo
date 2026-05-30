import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const PERSONAS = [
  { id: 'editor', emoji: '🎬', name: 'Strict Editor', desc: 'Professional & brutal', color: '#ef4444' },
  { id: 'viewer', emoji: '😏', name: 'Sarcastic Viewer', desc: 'Funny & honest', color: '#f97316' },
  { id: 'strategist', emoji: '📈', name: 'YT Strategist', desc: 'Growth & algorithm', color: '#3b82f6' },
  { id: 'coach', emoji: '🤩', name: 'Supportive Coach', desc: 'Kind & encouraging', color: '#22c55e' },
];

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function ScoreRing({ score, size = 110 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { setTimeout(() => setAnimated(score), 200); }, [score]);
  const r = (size - 16) / 2, circ = 2 * Math.PI * r, dash = (animated / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : score >= 40 ? '#eab308' : '#ef4444';
  const label = score >= 80 ? 'GREAT' : score >= 60 ? 'GOOD' : score >= 40 ? 'MEH' : 'ROUGH';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 900, color }}>{score}</div>
        <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, letterSpacing: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function MiniBar({ score }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW(score / 10 * 100), 300); }, [score]);
  const color = score >= 8 ? '#22c55e' : score >= 6 ? '#f97316' : score >= 4 ? '#eab308' : '#ef4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${w}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 1.2s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 18 }}>{score}</span>
    </div>
  );
}

function Card({ data, title, emoji, delay }) {
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 18, animation: `fadeUp 0.5s ease ${delay}ms both` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{emoji}</span>
          <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{title}</span>
        </div>
        <div style={{ width: 120 }}><MiniBar score={data.score} /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { bg: '#052e16', border: '#166534', label: '✓ WORKS', lc: '#4ade80', tc: '#86efac', text: data.good },
          { bg: '#2d0a0a', border: '#7f1d1d', label: '✗ PROBLEM', lc: '#f87171', tc: '#fca5a5', text: data.bad },
          { bg: '#1e1a00', border: '#78350f', label: '→ FIX', lc: '#fbbf24', tc: '#fde68a', text: data.fix },
        ].map((row, i) => (
          <div key={i} style={{ background: row.bg, border: `1px solid ${row.border}`, borderRadius: 8, padding: '9px 12px' }}>
            <div style={{ fontSize: 10, color: row.lc, fontWeight: 700, letterSpacing: 1 }}>{row.label}</div>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: row.tc, lineHeight: 1.5 }}>{row.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Loader({ persona }) {
  const p = PERSONAS.find(x => x.id === persona);
  const steps = ['Fetching YouTube data...', 'Analyzing title & thumbnail...', 'Checking stats & SEO...', 'Evaluating channel...', 'Generating roast...'];
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1200); return () => clearInterval(t); }, []);
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <div style={{ fontSize: 56, marginBottom: 12, animation: 'bob 1s ease-in-out infinite' }}>{p?.emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>{p?.name} is analyzing...</div>
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>Using real YouTube data</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 100, padding: '8px 18px' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: p?.color, animation: 'pulse 0.8s infinite' }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>{steps[step]}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [persona, setPersona] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  const analyze = async () => {
    const vid = extractVideoId(url.trim());
    if (!url.trim()) { setError('Paste a YouTube URL first!'); return; }
    if (!vid) { setError("Doesn't look like a valid YouTube URL"); return; }
    setError(''); setResult(null); setVideoData(null); setLoading(true);
    try {
      const ytRes = await fetch(`/api/youtube?videoId=${vid}`);
      const yt = await ytRes.json();
      if (yt.error) throw new Error(yt.error);
      setVideoData(yt);

      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoData: yt, persona }),
      });
      const analysis = await aiRes.json();
      if (analysis.error) throw new Error(analysis.error);
      setResult({ ...analysis, videoId: vid });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
  };

  const p = PERSONAS.find(x => x.id === persona);
  const cards = [
    { key: 'thumbnail', title: 'Thumbnail', emoji: '🖼️' },
    { key: 'title', title: 'Title & Hook', emoji: '✍️' },
    { key: 'retention', title: 'Viewer Retention', emoji: '📊' },
    { key: 'seo', title: 'SEO & Discovery', emoji: '🔍' },
    { key: 'stats', title: 'Stats Analysis', emoji: '📈' },
  ];

  return (
    <>
      <Head>
        <title>RoastMyVideo — AI YouTube Video Analyzer</title>
        <meta name="description" content="Get brutal AI feedback on why your YouTube video isn't working. Real data, real fixes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#020617' }}>
        {/* NAV */}
        <nav style={{ padding: '14px 20px', borderBottom: '1px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#020617', zIndex: 10 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, color: '#f1f5f9' }}>🎬 ROASTMYVIDEO</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/pricing" style={{ background: 'none', border: '1px solid #1e293b', borderRadius: 8, padding: '6px 12px', color: '#64748b', fontSize: 12, cursor: 'pointer', textDecoration: 'none' }}>Pricing</a>
            <a href="#" style={{ background: '#3b82f6', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', textDecoration: 'none' }}>Get Pro →</a>
          </div>
        </nav>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
          {/* HERO */}
          <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
            <div style={{ display: 'inline-block', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 100, padding: '5px 14px', fontSize: 11, color: '#64748b', letterSpacing: 2, fontWeight: 600, marginBottom: 18 }}>
              REAL AI · REAL YOUTUBE DATA
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(44px,12vw,76px)', lineHeight: 0.95, letterSpacing: 2, margin: '0 0 14px', background: 'linear-gradient(160deg,#f1f5f9,#475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              WHY ISN'T YOUR<br />VIDEO WORKING?
            </h1>
            <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Paste any YouTube link. Get a real AI breakdown<br />of exactly what's wrong — and how to fix it.
            </p>
          </div>

          {/* PERSONA */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>WHO'S ROASTING YOU?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
              {PERSONAS.map(x => (
                <button key={x.id} onClick={() => setPersona(x.id)} style={{ background: persona === x.id ? '#0f172a' : 'transparent', border: `1px solid ${persona === x.id ? x.color : '#1e293b'}`, borderRadius: 10, padding: '10px 6px', cursor: 'pointer', textAlign: 'center', boxShadow: persona === x.id ? `0 0 14px ${x.color}30` : 'none', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: 20, marginBottom: 3 }}>{x.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: persona === x.id ? x.color : '#64748b' }}>{x.name}</div>
                  <div style={{ fontSize: 9, color: '#334155', marginTop: 1 }}>{x.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input value={url} onChange={e => { setUrl(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="https://youtube.com/watch?v=..."
              style={{ width: '100%', background: '#0f172a', border: `1px solid ${error ? '#ef4444' : '#1e293b'}`, borderRadius: 12, padding: '14px 148px 14px 14px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
            <button onClick={analyze} disabled={loading} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: loading ? '#1e293b' : `linear-gradient(135deg,${p?.color},${p?.color}bb)`, border: 'none', borderRadius: 8, padding: '9px 14px', color: '#fff', fontWeight: 800, fontSize: 12, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 1, transition: 'all 0.2s', boxShadow: loading ? 'none' : `0 4px 16px ${p?.color}40` }}>
              {loading ? 'ANALYZING...' : 'ROAST IT →'}
            </button>
          </div>

          {error && <div style={{ fontSize: 13, color: '#ef4444', marginBottom: 8 }}>⚠ {error}</div>}
          <div style={{ fontSize: 12, color: '#334155', marginBottom: 28 }}>Works with any public YouTube video</div>

          {loading && <Loader persona={persona} />}

          {result && !loading && (
            <div ref={resultRef}>
              {/* Video card */}
              {videoData && (
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 14, marginBottom: 12, display: 'flex', gap: 12 }}>
                  <img src={videoData.thumbnail} alt="thumb" style={{ width: 110, height: 62, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>{videoData.title}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 11, color: '#475569' }}>{videoData.channelTitle} · {formatNum(videoData.subscriberCount)} subs</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[['👁️', videoData.viewCount], ['👍', videoData.likeCount], ['💬', videoData.commentCount]].map(([e, n]) => (
                        <span key={e} style={{ fontSize: 11, color: '#64748b' }}>{e} {formatNum(n)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Score */}
              <div style={{ background: '#0a0f1e', border: '1px solid #1e293b', borderRadius: 16, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 18 }}>
                <ScoreRing score={result.score} size={100} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>{p?.emoji} {p?.name.toUpperCase()} SAYS</div>
                  <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4 }}>"{result.verdict}"</p>
                  <div style={{ background: '#1e1a00', border: '1px solid #78350f', borderRadius: 8, padding: '9px 12px' }}>
                    <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, letterSpacing: 1 }}>🔥 #1 FIX RIGHT NOW</div>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#fde68a', lineHeight: 1.5 }}>{result.topFix}</p>
                  </div>
                </div>
              </div>

              {/* Channel trend */}
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '12px 14px', marginBottom: 12, display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 16 }}>📡</span>
                <div>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>CHANNEL POTENTIAL</div>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{result.channelTrend}</p>
                </div>
              </div>

              {/* Analysis cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cards.map((c, i) => result[c.key] && <Card key={c.key} data={result[c.key]} title={c.title} emoji={c.emoji} delay={i * 100} />)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => { navigator.clipboard?.writeText(`My video scored ${result.score}/100 on RoastMyVideo! 🎬 Check yours at roastmyvideo.vercel.app`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ flex: 1, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 12, color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  {copied ? '✓ Copied!' : '📤 Share Score'}
                </button>
                <button onClick={() => { setResult(null); setUrl(''); setVideoData(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ flex: 1, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none', borderRadius: 10, padding: 12, color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                  🎬 Roast Another
                </button>
              </div>

              {/* Pro upsell */}
              <div style={{ margin: '14px 0 48px', background: 'linear-gradient(135deg,#1e1b4b,#0f172a)', border: '1px solid #3730a3', borderRadius: 12, padding: 18, textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: 1, marginBottom: 5 }}>🔒 PRO UNLOCKS MORE</div>
                <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b' }}>Audio analysis, speech patterns, editing pace & weekly auto-analysis of your entire channel</p>
                <button style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, padding: '10px 22px', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                  UPGRADE TO PRO — $19/mo
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          {!result && !loading && (
            <div style={{ paddingBottom: 48 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                {[['🖼️','Thumbnail','Color & contrast'],['✍️','Title','Keywords & hook'],['📊','Retention','Drop-off points'],['🔍','SEO','Tags & search'],['📈','Stats','Engagement rate'],['📡','Channel','Growth potential']].map(([e,t,d]) => (
                  <div key={t} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 5 }}>{e}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{t}</div>
                    <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 14 }}>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>3 free analyses</span>
                <span style={{ color: '#334155', fontSize: 13 }}> · No credit card · Works on any public video</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
