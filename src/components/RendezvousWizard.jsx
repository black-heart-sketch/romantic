import { useState } from 'react'

const VIBES = [
  { id: 'dinner',   icon: '🍽️',  label: 'Dîner romantique' },
  { id: 'cinema',   icon: '🎬',  label: 'Soirée cinéma' },
  { id: 'picnic',   icon: '🧺',  label: 'Pique-nique au coucher du soleil' },
  { id: 'walk',     icon: '🌙',  label: 'Balade nocturne' },
  { id: 'coffee',   icon: '☕',  label: 'Pause café cosy' },
  { id: 'surprise', icon: '🎁',  label: 'Laisse-moi te surprendre' },
]

const STEPS = [
  { id: 'vibe',     label: "L'Ambiance" },
  { id: 'when',     label: 'Date & Heure' },
  { id: 'where',    label: 'Le Lieu' },
  { id: 'note',     label: 'Mot Doux' },
]

export default function RendezvousWizard({ onComplete, onBack }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    vibe: null,
    date: '',
    time: '',
    place: '',
    note: '',
  })

  const total = STEPS.length
  const pct   = ((step + 1) / total) * 100

  function next() {
    if (step < total - 1) setStep((s) => s + 1)
    else onComplete(data)
  }

  function back() {
    if (step === 0) onBack()
    else setStep((s) => s - 1)
  }

  // Validation par étape
  const canProceed =
    (step === 0 && data.vibe) ||
    (step === 1 && data.date && data.time) ||
    (step === 2 && data.place.trim().length > 0) ||
    (step === 3)

  return (
    <div className="card" role="main" aria-label="Organiser notre rendez-vous">
      {/* Barre de progression */}
      <div className="progress-wrap">
        <p className="progress-label">Étape {step + 1} sur {total} — {STEPS[step].label}</p>
        <div className="progress-track" role="progressbar" aria-valuenow={step + 1} aria-valuemax={total}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Points d'étape */}
      <div className="step-dots" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`dot ${i < step ? 'done' : i === step ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Contenu de l'étape */}
      <div className="step-content" key={step}>
        {step === 0 && <StepVibe data={data} setData={setData} />}
        {step === 1 && <StepWhen data={data} setData={setData} />}
        {step === 2 && <StepWhere data={data} setData={setData} />}
        {step === 3 && <StepNote data={data} setData={setData} />}
      </div>

      <div className="btn-row">
        <button id="btn-wizard-back" className="btn btn-back" onClick={back}>
          ← Retour
        </button>
        <button
          id="btn-wizard-next"
          className="btn btn-next"
          onClick={next}
          disabled={!canProceed}
          style={{ opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
        >
          {step === total - 1 ? 'Envoyer 💌' : 'Suivant →'}
        </button>
      </div>
    </div>
  )
}

/* ── ÉTAPES ───────────────────────────────────────────────── */

function StepVibe({ data, setData }) {
  return (
    <>
      <span className="emoji-big" style={{ fontSize: '2.6rem' }}>💑</span>
      <h2 className="title" style={{ fontSize: '1.7rem' }}>Quelle ambiance tu préfères ?</h2>
      <p className="subtitle">Choisis le type de rendez-vous qui te ferait plaisir</p>
      <div className="option-grid">
        {VIBES.map((v) => (
          <button
            key={v.id}
            id={`opt-${v.id}`}
            className={`option-card ${data.vibe === v.id ? 'selected' : ''}`}
            onClick={() => setData((d) => ({ ...d, vibe: v.id }))}
            aria-pressed={data.vibe === v.id}
          >
            <span className="opt-icon">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>
    </>
  )
}

function StepWhen({ data, setData }) {
  return (
    <>
      <span className="emoji-big" style={{ fontSize: '2.6rem' }}>📅</span>
      <h2 className="title" style={{ fontSize: '1.7rem' }}>Quand est-ce qu'on se voit ?</h2>
      <p className="subtitle">Choisis un jour et une heure qui te conviennent</p>
      <input
        id="input-date"
        type="date"
        className="input-field"
        value={data.date}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => setData((d) => ({ ...d, date: e.target.value }))}
        aria-label="Choisir une date"
      />
      <input
        id="input-time"
        type="time"
        className="input-field"
        value={data.time}
        onChange={(e) => setData((d) => ({ ...d, time: e.target.value }))}
        style={{ marginTop: '0.8rem' }}
        aria-label="Choisir une heure"
      />
    </>
  )
}

function StepWhere({ data, setData }) {
  const places = [
    { icon: '🍹', name: 'Lounge / Rooftop chic' },
    { icon: '🍨', name: 'Glacier / Salon de thé' },
    { icon: '🍗', name: 'Resto cosy & Poisson braisé' },
    { icon: '🌿', name: 'Un endroit calme & discret' },
  ]
  return (
    <>
      <span className="emoji-big" style={{ fontSize: '2.6rem' }}>📍</span>
      <h2 className="title" style={{ fontSize: '1.7rem' }}>Où aimerais-tu qu'on aille ?</h2>
      <p className="subtitle">Choisis une idée ou propose ton endroit préféré</p>
      <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '0.5rem' }}>
        {places.map((p) => (
          <button
            key={p.name}
            id={`place-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
            className={`option-card ${data.place === p.name ? 'selected' : ''}`}
            onClick={() => setData((d) => ({ ...d, place: p.name }))}
            aria-pressed={data.place === p.name}
          >
            <span className="opt-icon">{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>
      <input
        id="input-place"
        className="input-field"
        type="text"
        placeholder="Ou écris un endroit spécifique…"
        value={data.place}
        onChange={(e) => setData((d) => ({ ...d, place: e.target.value }))}
        aria-label="Entrer un lieu"
      />
    </>
  )
}

function StepNote({ data, setData }) {
  return (
    <>
      <span className="emoji-big" style={{ fontSize: '2.6rem' }}>💌</span>
      <h2 className="title" style={{ fontSize: '1.7rem' }}>Une dernière chose…</h2>
      <p className="subtitle">Laisse-moi un petit mot doux (optionnel) 🥰</p>
      <textarea
        id="input-note"
        className="input-field"
        placeholder="ex: J'ai trop hâte de te voir… 💕"
        rows={4}
        value={data.note}
        onChange={(e) => setData((d) => ({ ...d, note: e.target.value }))}
        style={{ resize: 'none', lineHeight: 1.6 }}
        aria-label="Écrire un mot doux"
      />
    </>
  )
}
