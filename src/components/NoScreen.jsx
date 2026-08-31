export default function NoScreen({ onBack }) {
  return (
    <div className="card no-screen" role="main" aria-label="Réponse non">
      <span className="emoji-big" style={{ animationDelay: '0.1s' }}>😢</span>
      <h2 className="title" style={{ fontSize: '1.9rem' }}>
        Oh non…
      </h2>
      <p className="subtitle" style={{ marginBottom: '1rem' }}>
        Ça me brise vraiment le cœur. 💔<br />
        Tu es <em>vraiment</em> sûre ?
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Je te promets que je vais me rattraper…
      </p>
      <button
        id="btn-give-chance"
        className="btn btn-yes"
        onClick={onBack}
        aria-label="Donner une autre chance"
      >
        Donne-moi une autre chance 🙏
      </button>
    </div>
  )
}
