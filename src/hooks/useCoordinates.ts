import { useEffect, useState } from 'react'
import { deleteScreenshots } from '../lib/screenshots'
import type { Coordinate } from '../types'

const STORAGE_KEY = 'sky-closet:coordinates'

/** テキスト入力方式で保存された旧データ（部位に「楽器」が独立していた頃のもの） */
type LegacyParts = Record<string, string | undefined>
type LegacyCoordinate = Omit<Coordinate, 'items' | 'legacyParts'> & {
  parts: LegacyParts
}

/** 旧「楽器」欄のテキストを「持ち歩きアイテム」にまとめる */
function mergeInstrument({ instrument, ...parts }: LegacyParts) {
  const prop = [parts.prop, instrument].filter(Boolean).join(' / ')
  return { ...parts, prop }
}

function migrate(raw: Coordinate | LegacyCoordinate): Coordinate {
  if (!('items' in raw)) {
    const { parts, ...rest } = raw
    return { ...rest, items: {}, legacyParts: mergeInstrument(parts) }
  }
  if (raw.legacyParts && 'instrument' in raw.legacyParts) {
    return {
      ...raw,
      legacyParts: mergeInstrument(raw.legacyParts as LegacyParts),
    }
  }
  return raw
}

function load(): Coordinate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as (Coordinate | LegacyCoordinate)[]).map(migrate) : []
  } catch {
    return []
  }
}

export function useCoordinates() {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coordinates))
  }, [coordinates])

  const add = (input: Omit<Coordinate, 'id' | 'createdAt'>) => {
    const coordinate: Coordinate = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setCoordinates((prev) => [coordinate, ...prev])
  }

  const remove = (id: string) => {
    const screenshotIds = coordinates.find((c) => c.id === id)?.screenshotIds
    if (screenshotIds?.length) {
      deleteScreenshots(screenshotIds).catch((e) =>
        console.error('スナップの削除に失敗しました', e),
      )
    }
    setCoordinates((prev) => prev.filter((c) => c.id !== id))
  }

  return { coordinates, add, remove }
}
