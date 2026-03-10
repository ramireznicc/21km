import DayCard from './DayCard'
import styles from './WeekSection.module.css'

export default function WeekSection({ week, checked, onCheck, todayId }) {
  return (
    <div className={styles.week}>
      <div className={styles.header}>
        <span className={styles.title}>{week.title} — </span>
        <span className={styles.subtitle}>{week.subtitle}</span>
        {week.note && <span className={styles.note}>{week.note}</span>}
      </div>
      {week.days.map(day => (
        <DayCard
          key={day.id}
          day={day}
          checked={checked.has(day.id)}
          onCheck={onCheck}
          isToday={day.id === todayId}
        />
      ))}
    </div>
  )
}
