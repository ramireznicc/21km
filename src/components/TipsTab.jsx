import { tips } from '../data'
import styles from './TipsTab.module.css'

export default function TipsTab() {
  return (
    <div>
      {tips.map(tip => (
        <div key={tip.id} className={styles.card}>
          <div className={styles.title}>{tip.icon} {tip.title}</div>
          <ul className={styles.list}>
            {tip.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
