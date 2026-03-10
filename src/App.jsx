import { useState, useEffect, useMemo } from 'react'
import { weeks } from './data'
import WeekSection from './components/WeekSection'
import TipsTab from './components/TipsTab'
import styles from './App.module.css'

const STORAGE_KEY = '21km-checked'
const RACE_DATE = new Date(2026, 2, 29) // March 29, 2026

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveChecked(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

function getDaysToRace() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const race = new Date(RACE_DATE)
  race.setHours(0, 0, 0, 0)
  return Math.ceil((race - today) / (1000 * 60 * 60 * 24))
}

function getTodayId() {
  const today = new Date()
  if (today.getFullYear() !== 2026 || today.getMonth() !== 2) return null
  const dayNum = today.getDate()
  for (const week of weeks) {
    for (const day of week.days) {
      const num = parseInt(day.date.split(' ')[1])
      if (num === dayNum) return day.id
    }
  }
  return null
}

function getDaysLabel(diff) {
  if (diff > 1) return `Faltan ${diff} días`
  if (diff === 1) return 'Mañana es la carrera'
  if (diff === 0) return 'Hoy es la carrera 🏁'
  return '21K completada 🎉'
}

export default function App() {
  const [tab, setTab] = useState('plan')
  const [checked, setChecked] = useState(loadChecked)
  const todayId = useMemo(() => getTodayId(), [])
  const daysToRace = useMemo(() => getDaysToRace(), [])

  useEffect(() => {
    if (!todayId) return
    const el = document.getElementById(todayId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [todayId])

  function handleCheck(id) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      saveChecked(next)
      return next
    })
  }

  const totalDays = weeks.reduce((acc, w) => acc + w.days.length, 0)
  const completedDays = checked.size

  return (
    <div className={styles.app}>
      <header className={styles.hero}>
        <div className={styles.badge}>La promesa</div>
        <h1 className={styles.title}>21 KM</h1>
        <p className={styles.sub}>Plan de entrenamiento</p>
        <div className={styles.countdown}>{getDaysLabel(daysToRace)}</div>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(completedDays / totalDays) * 100}%` }}
            />
          </div>
          <span className={styles.progressLabel}>{completedDays} / {totalDays} días</span>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'plan' ? styles.tabActive : ''}`}
          onClick={() => setTab('plan')}
        >
          📅 Plan semanal
        </button>
        <button
          className={`${styles.tab} ${tab === 'tips' ? styles.tabActive : ''}`}
          onClick={() => setTab('tips')}
        >
          💡 Consejos
        </button>
      </div>

      <div className={styles.content}>
        {tab === 'plan' && (
          <>
            {weeks.map(week => (
              <WeekSection
                key={week.id}
                week={week}
                checked={checked}
                onCheck={handleCheck}
                todayId={todayId}
              />
            ))}
          </>
        )}
        {tab === 'tips' && <TipsTab />}
      </div>

      <footer className={styles.footer}>
        Plan armado para Nico · Rosario, marzo 2026 · 💪 Podés hacerlo
      </footer>
    </div>
  )
}
