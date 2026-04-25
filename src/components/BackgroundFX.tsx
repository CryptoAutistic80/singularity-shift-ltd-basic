import { useEffect, useMemo } from 'react'

const NODE_COUNT = 6

export default function BackgroundFX() {
  const seeds = useMemo(() => new Array(NODE_COUNT).fill(0), [])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMotionClass = () => {
      document.body.classList.toggle('low-motion-fx', motionQuery.matches)
    }

    updateMotionClass()
    motionQuery.addEventListener('change', updateMotionClass)
    return () => motionQuery.removeEventListener('change', updateMotionClass)
  }, [])

  return (
    <div aria-hidden="true" className="background-fx" role="presentation">
      <div className="background-fx__mesh" />
      <div className="background-fx__scanline" />
      {seeds.map((_, index) => (
        <span
          key={index}
          className={`background-fx__node background-fx__node--${index + 1}`}
        />
      ))}
    </div>
  )
}
