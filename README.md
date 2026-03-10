# 21 KM

Tracker personal de plan de entrenamiento para correr 21 km. Construido en 20 días de plan real, del 9 al 29 de marzo de 2026.

## Features

- **Plan semanal** con 21 días de entrenamiento divididos en 3 semanas: reactivación, consolidación y tapering
- **Checkmarks persistentes** — cada día se puede marcar como completado, el estado sobrevive recargas via localStorage
- **Expand/collapse** animado para ver el detalle de cada entrenamiento
- **Tipos de entrenamiento** diferenciados visualmente: carrera, fuerza, descanso, día libre y carrera final
- **Entrenamientos de fuerza detallados** — ejercicios sin equipamiento, solo colchoneta, con calentamiento, circuito y estiramiento final
- **Contador regresivo** hasta el día de la carrera, calculado dinámicamente
- **Resaltado del día de hoy** con scroll automático al abrir la app
- **Vibración háptica** al marcar un entrenamiento como completado (mobile)
- **Sección de consejos** con tarjetas de alimentación, hidratación, estiramiento, equipamiento, señales de alerta y estrategia mental
- **Email diario automático** a las 9am con el entrenamiento del día via GitHub Actions + Resend

## Stack

- Vite + React (sin TypeScript)
- CSS Modules — sin librerías de UI
- localStorage para persistencia
- GitHub Actions para el email diario
- Resend como servicio de email

## Diseño

Dark theme inspirado en GitHub: `#0d1117` de fondo, tipografía Bebas Neue para títulos y DM Sans para el resto. Colores por tipo de entrenamiento: verde para carrera, violeta para fuerza, azul para estiramiento, naranja para días libres y rojo para la carrera final.
