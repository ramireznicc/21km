import { weeks } from '../src/data.js'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = 'ramireznicc.23@gmail.com'
const FROM_EMAIL = 'onboarding@resend.dev'

function getTodayEntry() {
  // Argentina = UTC-3, always
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  const dayNum = now.getDate()
  const month = now.getMonth() // 2 = March

  if (month !== 2 || now.getFullYear() !== 2026) return null

  for (const week of weeks) {
    for (const day of week.days) {
      const num = parseInt(day.date.split(' ')[1])
      if (num === dayNum) return { day, week }
    }
  }
  return null
}

const TYPE_COLORS = {
  run:      '#3fb950',
  rest:     '#6e7681',
  stretch:  '#58a6ff',
  strength: '#bc8cff',
  free:     '#f0883e',
  race:     '#ff6b6b',
}

const TYPE_LABELS = {
  run:      'Carrera',
  rest:     'Descanso',
  stretch:  'Estiramiento',
  strength: 'Fuerza',
  free:     'Libre',
  race:     '🏁 La carrera',
}

function renderDetail(detail) {
  if (typeof detail === 'string') {
    return `<p style="margin:0;color:#8b949e;font-size:15px;line-height:1.7;">${detail}</p>`
  }

  return detail.map(block => `
    <div style="margin-bottom:16px;">
      ${block.title ? `<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7d8590;">${block.title}</p>` : ''}
      <ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px;">
        ${block.items.map(item => `<li style="color:#8b949e;font-size:14px;line-height:1.65;">${item}</li>`).join('')}
      </ul>
    </div>
  `).join('')
}

function buildEmail(day, week) {
  const accentColor = TYPE_COLORS[day.type] || '#3fb950'
  const typeLabel = TYPE_LABELS[day.type] || day.type
  const detailHtml = renderDetail(day.detail)

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px 48px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7d8590;">
        ${week.title} — ${week.subtitle}
      </p>
      <h1 style="margin:0;font-size:48px;font-weight:900;letter-spacing:2px;color:#e6edf3;line-height:1;">
        21 KM
      </h1>
      <p style="margin:8px 0 0;font-size:13px;color:#7d8590;">Plan de entrenamiento · Nico</p>
    </div>

    <!-- Day card -->
    <div style="background:#161b22;border:1px solid ${accentColor};border-radius:16px;overflow:hidden;">

      <!-- Card header -->
      <div style="padding:20px 24px;border-bottom:1px solid #21262d;display:flex;align-items:center;gap:14px;">
        <span style="font-size:32px;">${day.emoji}</span>
        <div style="flex:1;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#e6edf3;line-height:1.2;">${day.title}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#7d8590;font-weight:500;">${day.date} de marzo</p>
        </div>
        <span style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;border-radius:20px;background:${accentColor}22;color:${accentColor};">
          ${typeLabel}
        </span>
      </div>

      <!-- Detail -->
      <div style="padding:20px 24px;">
        ${detailHtml}
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;margin-top:32px;font-size:12px;color:#484f58;">
      Rosario, marzo 2026 · 💪 Podés hacerlo
    </p>
  </div>
</body>
</html>`
}

async function main() {
  const entry = getTodayEntry()

  if (!entry) {
    console.log('No hay entrenamiento para hoy, no se envía email.')
    process.exit(0)
  }

  const { day, week } = entry
  const html = buildEmail(day, week)

  const subjectEmoji = { run: '🏃', rest: '😴', stretch: '🧘', strength: '💪', free: '🎉', race: '🏁' }
  const subject = `${subjectEmoji[day.type] || ''} ${day.date} de marzo — ${day.title}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Error enviando email:', err)
    process.exit(1)
  }

  const data = await res.json()
  console.log('Email enviado:', data.id)
}

main()
