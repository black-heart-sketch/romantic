const VIBE_LABELS = {
  dinner: '🍽️ Romantic dinner',
  cinema: '🎬 Cinema night',
  picnic: '🧺 Sunset picnic',
  walk: '🌙 Evening stroll',
  coffee: '☕ Cozy café date',
  surprise: '🎁 Let me surprise you',
}

export default function SuccessScreen({ data }) {
  if (!data) return null

  return (
    <div className="card success-card" role="main" aria-label="Rendezvous confirmed">
      <span className="confetti-emoji" role="img" aria-label="Celebration">🎉</span>
      <h1 className="title" style={{ marginTop: '0.5rem' }}>
        It's a date! 💕
      </h1>
      <p className="subtitle">
        Thank you for forgiving me. I can't wait! 🥰
      </p>

      <div className="summary-box">
        <div className="summary-row">
          <span className="s-icon">✨</span>
          <span>Vibe:</span>
          <span className="s-val">{VIBE_LABELS[data.vibe] || data.vibe}</span>
        </div>
        <div className="summary-row">
          <span className="s-icon">📅</span>
          <span>Date:</span>
          <span className="s-val">{data.date} at {data.time}</span>
        </div>
        <div className="summary-row">
          <span className="s-icon">📍</span>
          <span>Place:</span>
          <span className="s-val">{data.place}</span>
        </div>
        {data.note && (
          <div className="summary-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
              <span className="s-icon">💌</span>
              <span>Note:</span>
            </div>
            <span className="s-val" style={{ fontStyle: 'italic', fontWeight: 'normal', paddingLeft: '1.9rem', color: '#ffb3d9' }}>
              "{data.note}"
            </span>
          </div>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
        Screenshot this or save the date! 💖
      </p>
    </div>
  )
}
