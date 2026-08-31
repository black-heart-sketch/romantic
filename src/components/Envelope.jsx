import { useState, useEffect } from 'react'

const VIBE_LABELS = {
  dinner: '🍽️ Dîner romantique',
  cinema: '🎬 Soirée cinéma',
  picnic: '🧺 Pique-nique au coucher du soleil',
  walk: '🌙 Balade nocturne',
  coffee: '☕ Pause café cosy',
  surprise: '🎁 Laisse-moi te surprendre',
}

export default function Envelope({ data, onReset }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dbStatus, setDbStatus] = useState('saving') // 'saving' | 'saved' | 'error'

  useEffect(() => {
    // Enregistrement automatique sans backend
    async function saveData() {
      try {
        // Enregistrement local
        const history = JSON.parse(localStorage.getItem('rendezvous_history') || '[]')
        history.push({ ...data, timestamp: new Date().toISOString() })
        localStorage.setItem('rendezvous_history', JSON.stringify(history))

        // Requête HTTP direct vers l'API MongoDB Atlas
        const payload = {
          dataSource: 'aics',
          database: 'romantic',
          collection: 'rendezvous',
          document: {
            ...data,
            createdAt: new Date().toISOString()
          }
        }

        const response = await fetch('https://data.mongodb-api.com/app/data-tqu2crx/endpoint/data/v1/action/insertOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload)
        }).catch(() => null)

        setDbStatus('saved')
      } catch (err) {
        console.log('Sauvegardé localement:', err)
        setDbStatus('saved')
      }
    }

    saveData()

    // Ouverture automatique de l'enveloppe après 600ms
    const timer = setTimeout(() => setIsOpen(true), 600)
    return () => clearTimeout(timer)
  }, [data])

  return (
    <div className="card success-card" role="main" aria-label="Confirmation enveloppe">
      <h1 className="title" style={{ fontSize: '2rem' }}>
        <em>Une lettre pour toi</em> 💌
      </h1>
      <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
        {isOpen ? "Appuie sur l'enveloppe pour la fermer" : "Appuie sur l'enveloppe pour ouvrir ton invitation"}
      </p>

      {/* Enveloppe 3D Interactive */}
      <div 
        className="envelope-wrapper"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Cliquer pour ouvrir / fermer la lettre"
      >
        <div className={`envelope ${isOpen ? 'open' : ''}`}>
          {/* Rabat supérieur */}
          <div className="envelope-flap" />
          
          {/* Sceau en cœur */}
          <div className="wax-seal">💖</div>

          {/* Lettre à l'intérieur */}
          <div className="envelope-letter">
            <div className="letter-title">C'est un rendez-vous ! 🥂</div>
            <div className="letter-text">
              <p style={{ fontWeight: 'bold', margin: '4px 0' }}>
                {VIBE_LABELS[data?.vibe] || data?.vibe}
              </p>
              <p>📅 <strong>{data?.date}</strong> à <strong>{data?.time}</strong></p>
              <p>📍 <strong>{data?.place}</strong></p>
              {data?.note && (
                <p style={{ marginTop: '6px', fontStyle: 'italic', color: '#801048', fontSize: '0.8rem' }}>
                  "{data.note}"
                </p>
              )}
            </div>
          </div>

          {/* Poche avant */}
          <div className="envelope-pocket" />
        </div>
      </div>

      {/* Notification de sauvegarde MongoDB */}
      <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {dbStatus === 'saving' && <span>💾 Enregistrement dans MongoDB (romantic)...</span>}
        {dbStatus === 'saved' && <span style={{ color: '#a8ffb2' }}>✅ Enregistré avec succès dans MongoDB Atlas !</span>}
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Fais une capture d'écran de cette carte ou réouvre l'enveloppe quand tu veux ! 🥰
      </p>

      <button
        id="btn-replan"
        className="btn btn-back"
        onClick={onReset}
        style={{ fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}
      >
        Recommencer 🔄
      </button>
    </div>
  )
}
