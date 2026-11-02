import { useEffect, useState } from 'react'
import { blobToDataUrl, getScreenshot } from '../lib/screenshots'

/** 保存済みスナップの表示用 URL（読み込み中・見つからない場合は undefined） */
export function useScreenshotUrl(id: string) {
  const [loaded, setLoaded] = useState<{ id: string; url?: string }>()

  useEffect(() => {
    let cancelled = false
    getScreenshot(id)
      .then((blob) => (blob ? blobToDataUrl(blob) : undefined))
      .then((url) => !cancelled && setLoaded({ id, url }))
      .catch((e) => console.error('スナップの読み込みに失敗しました', e))
    return () => {
      cancelled = true
    }
  }, [id])

  // id が切り替わった直後は、前の画像を出さない
  return loaded?.id === id ? loaded.url : undefined
}
