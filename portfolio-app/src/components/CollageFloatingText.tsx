import { useMemo } from 'react'
import floatingTextsByLayout from '../data/floatingTexts.json'

type Position = {
  top: number
  left: number
}

type FloatingTextsMap = Record<string, string[]>

const FLOAT_ZONES: { top: [number, number]; left: [number, number] }[] = [
  { top: [4, 18], left: [70, 90] },
  { top: [78, 92], left: [6, 28] },
  { top: [76, 90], left: [68, 88] },
  { top: [6, 18], left: [4, 22] },
  { top: [38, 52], left: [78, 92] },
  { top: [40, 54], left: [2, 16] },
]

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickPositions(count: number): Position[] {
  const zones = [...FLOAT_ZONES].sort(() => Math.random() - 0.5)

  return Array.from({ length: count }, (_, index) => {
    const zone = zones[index % zones.length]
    return {
      top: randBetween(zone.top[0], zone.top[1]),
      left: randBetween(zone.left[0], zone.left[1]),
    }
  })
}

type CollageFloatingTextProps = {
  layout: string
}

export function CollageFloatingText({ layout }: CollageFloatingTextProps) {
  const items = useMemo(() => {
    const texts = (floatingTextsByLayout as FloatingTextsMap)[layout] ?? []
    const positions = pickPositions(texts.length)

    return texts.map((text, index) => ({
      text,
      position: positions[index],
    }))
  }, [layout])

  return (
    <>
      {items.map((item, index) => (
        <span
          key={`${layout}-${item.text}-${index}`}
          className="collage-float-text"
          style={{
            top: `${item.position.top}%`,
            left: `${item.position.left}%`,
          }}
        >
          {item.text}
        </span>
      ))}
    </>
  )
}
