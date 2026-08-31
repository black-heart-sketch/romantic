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
  const [emailStatus, setEmailStatus] = useState('sending') // 'sending' | 'sent' | 'saved'

  useEffect(() => {
    async function sendNotification() {
      try {
        // 1. Stockage local
        const history = JSON.parse(localStorage.getItem('rendezvous_history') || '[]')
        history.push({ ...data, timestamp: new Date().toISOString() })
        localStorage.setItem('rendezvous_history', JSON.stringify(history))

        // 2. Envoi d'email direct à tchouanana74@gmail.com via FormSubmit (100% compatible GitHub Pages)
        const emailResponse = await fetch('https://formsubmit.co/ajax/tchouanana74@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: '💖 Elle a dit OUI ! Rendez-vous confirmé 🥂',
            _template: 'table',
            _captcha: 'false',
            Ambiance: VIBE_LABELS[data?.vibe] || data?.vibe,
            Date: data?.date,
            Heure: data?.time,
            Lieu: data?.place,
            Mot_Doux: data?.note || 'Aucun mot',
          }),
        }).catch(() => null)

        if (emailResponse && emailResponse.ok) {
          setEmailStatus('sent')
        } else {
          setEmailStatus('saved')
        }

        // 3. Sauvegarde MongoDB Atlas optionnelle
        const payload = {
          dataSource: 'aics',
          database: 'romantic',
          collection: 'rendezvous',
          document: {
            ...data,
            createdAt: new Date().toISOString(),
          },
        }

        await fetch('https://data.mongodb-api.com/app/data-tqu2crx/endpoint/data/v1/action/insertOne', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        }).catch(() => null)
      } catch (err) {
        console.log('Stocké localement:', err)
        setEmailStatus('saved')
      }
    }

    sendNotification()

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

      {/* Notification de confirmation */}
      <div style={{ margin: '1rem 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {emailStatus === 'sending' && <span>📧 Envoi de la notification à tchouanana74@gmail.com...</span>}
        {emailStatus === 'sent' && <span style={{ color: '#a8ffb2' }}>📩 Email de confirmation envoyé à tchouanana74@gmail.com !</span>}
        {emailStatus === 'saved' && <span style={{ color: '#a8ffb2' }}>✅ Réponse enregistrée avec succès !</span>}
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
