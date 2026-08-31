import { useState } from 'react'

export default function ForgiveScreen({ onYes, onNo }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [noClicks, setNoClicks] = useState(0)

  // Le bouton "Non" s'échappe quand on le survole, le clique ou le touche sur mobile
  function dodge(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Adapt bounds dynamically for mobile screens so button stays visible
    const isMobile = window.innerWidth <= 600
    const maxX = isMobile ? Math.min(110, window.innerWidth * 0.3) : 220
    const maxY = isMobile ? Math.min(90, window.innerHeight * 0.2) : 120

    // Ensure it moves a noticeable distance away from current position
    let newX = (Math.random() - 0.5) * maxX * 2
    let newY = (Math.random() - 0.5) * maxY * 2

    // Avoid tiny jumps
    if (Math.abs(newX - noPos.x) < 40) newX += newX >= 0 ? 50 : -50
    if (Math.abs(newY - noPos.y) < 30) newY += newY >= 0 ? 40 : -40

    setNoPos({ x: newX, y: newY })
    setNoClicks((c) => c + 1)
  }

  const noLabels = [
    'Non 😒',
    'S\'il te plaît non…',
    'Tu es sûre ? 🥺',
    'Hmm… réfléchis encore',
    'Dernière chance ! 👀',
    'Tu n\'oserais pas !',
    'Bon d\'accord… 🙄',
  ]
  const noLabel = noLabels[Math.min(noClicks, noLabels.length - 1)]

  return (
    <div className="card" role="main" aria-label="Demande de pardon">
      <span className="emoji-big" aria-hidden="true">🥺</span>
      <h1 className="title">
        Est-ce que tu me<br /><em>pardonnes ?</em>
      </h1>
      <p className="subtitle">Je suis vraiment, tellement désolé(e)… s'il te plaît ? 💕</p>

      <div className="btn-row" style={{ position: 'relative', minHeight: '80px' }}>
        <button
          id="btn-yes"
          className="btn btn-yes"
          onClick={onYes}
          aria-label="Oui, je te pardonne"
        >
          Oui, bien sûr ! 💖
        </button>

        <button
          id="btn-no"
          className="btn btn-no"
          style={{
            transform: `translate(${noPos.x}px, ${noPos.y}px)`,
            transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          onMouseEnter={dodge}
          onClick={dodge}
          onTouchStart={dodge}
          aria-label="Bouton non"
        >
          {noLabel}
        </button>
      </div>
    </div>
  )
}
