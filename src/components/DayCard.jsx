import { useState } from 'react'
import styles from './DayCard.module.css'

const TYPE_LABELS = {
  run: 'Carrera',
  rest: 'Descanso',
  stretch: 'Estiramiento',
  strength: 'Fuerza',
  free: 'Libre',
  race: 'Carrera',
}

export default function DayCard({ day, checked, onCheck, isToday }) {
  const [open, setOpen] = useState(false)

  function handleCardClick() {
    setOpen(o => !o)
  }

  function handleCheckClick(e) {
    e.stopPropagation()
    if (navigator.vibrate) navigator.vibrate(50)
    onCheck(day.id)
  }

  return (
    <div
      id={day.id}
      className={[
        styles.card,
        open ? styles.open : '',
        checked ? styles.checked : '',
        isToday ? styles.today : '',
        styles[`type_${day.type}`],
      ].join(' ')}
      onClick={handleCardClick}
    >
      <div className={styles.header}>
        <span className={styles.emoji}>{day.emoji}</span>
        <div className={styles.info}>
          <div className={`${styles.title} ${checked ? styles.strikethrough : ''}`}>
            {day.title}
          </div>
          <div className={styles.date}>
            {day.date}
            {isToday && <span className={styles.todayBadge}>HOY</span>}
          </div>
        </div>
        <span className={`${styles.tag} ${styles[`tag_${day.type}`]}`}>
          {TYPE_LABELS[day.type]}
        </span>
        <button
          className={`${styles.checkBtn} ${checked ? styles.checkBtnDone : ''}`}
          onClick={handleCheckClick}
          aria-label={checked ? 'Desmarcar completado' : 'Marcar como completado'}
        >
          {checked ? '✓' : ''}
        </button>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
      </div>
      <div className={`${styles.detail} ${open ? styles.detailOpen : ''}`}>
        <div className={styles.detailInner}>
          {Array.isArray(day.detail)
            ? day.detail.map((block, i) => (
                <div key={i} className={styles.block}>
                  {block.title && <div className={styles.blockTitle}>{block.title}</div>}
                  <ul className={styles.blockList}>
                    {block.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                </div>
              ))
            : day.detail}
        </div>
      </div>
    </div>
  )
}
