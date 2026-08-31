import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Config SMTP Gmail avec les identifiants fournis
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tchouanana74@gmail.com',
    pass: 'fdza xrhk xshn huhr',
  },
})

// Endpoint d'envoi d'email
app.post('/api/send-email', async (req, res) => {
  try {
    const { vibe, date, time, place, note } = req.body

    const vibeLabels = {
      dinner: '🍽️ Dîner romantique',
      cinema: '🎬 Soirée cinéma',
      picnic: '🧺 Pique-nique au coucher du soleil',
      walk: '🌙 Balade nocturne',
      coffee: '☕ Pause café cosy',
      surprise: '🎁 Laisse-moi te surprendre',
    }

    const mailOptions = {
      from: '"Surprise Rendez-vous 💕" <tchouanana74@gmail.com>',
      to: 'tchouanana74@gmail.com',
      subject: '💖 Elle a dit OUI ! Nouveau rendez-vous confirmé 🥂',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 25px; border: 2px solid #e84393; border-radius: 15px; background-color: #fff0f6; color: #2d0a1e; margin: 0 auto;">
          <h2 style="color: #c0185e; text-align: center; margin-top: 0;">🎉 Bonne nouvelle !</h2>
          <p style="font-size: 16px; text-align: center;">Elle a accepté ton pardon et organisé le rendez-vous :</p>
          
          <div style="background: rgba(255,255,255,0.8); padding: 15px; border-radius: 10px; border: 1px solid #ff79c6; margin: 20px 0;">
            <p style="font-size: 15px; margin: 8px 0;"><strong>✨ Ambiance :</strong> ${vibeLabels[vibe] || vibe}</p>
            <p style="font-size: 15px; margin: 8px 0;"><strong>📅 Date & Heure :</strong> ${date} à ${time}</p>
            <p style="font-size: 15px; margin: 8px 0;"><strong>📍 Lieu :</strong> ${place}</p>
            ${note ? `<p style="font-size: 15px; margin: 8px 0; font-style: italic; color: #801048;"><strong>💌 Petit mot :</strong> "${note}"</p>` : ''}
          </div>

          <p style="text-align: center; color: #e84393; font-size: 13px; margin-bottom: 0;">
            Message envoyé automatiquement par ton application Surprise 💕
          </p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('📧 Email envoyé avec succès ! MessageID:', info.messageId)
    res.status(200).json({ success: true, messageId: info.messageId })
  } catch (error) {
    console.error('❌ Erreur envoi email SMTP:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Serveur Email SMTP actif sur http://localhost:${PORT}`)
})
