import { useMemo } from 'react'

const HEARTS = ['💗', '💕', '💖', '🌹', '💝', '🌸', '✨', '💞']

export default function HeartsBg() {
  const particles = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${8 + Math.random() * 10}s`,
      size: `${1 + Math.random() * 1.2}rem`,
      emoji: HEARTS[Math.floor(Math.random() * HEARTS.length)],
    }))
  }, [])

  return (
    <div className="hearts-bg" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
