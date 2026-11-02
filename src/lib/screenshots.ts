/**
 * コーデに添付するスナップの保存（IndexedDB）。
 * 画像は LocalStorage には大きすぎるため、Blob のまま IndexedDB に置き、
 * コーデ側には id だけを持たせる。
 */

const DB_NAME = 'sky-closet-screenshots'
const STORE = 'screenshots'
/** 保存時に縮小する長辺のサイズ */
const MAX_SIZE = 1600

type ScreenshotRecord = { id: string; blob: Blob }

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function run<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveScreenshot(blob: Blob): Promise<string> {
  const id = crypto.randomUUID()
  await run('readwrite', (s) => s.put({ id, blob } satisfies ScreenshotRecord))
  return id
}

export async function getScreenshot(id: string): Promise<Blob | undefined> {
  const record = await run<ScreenshotRecord | undefined>('readonly', (s) => s.get(id))
  return record?.blob
}

export async function deleteScreenshots(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => run('readwrite', (s) => s.delete(id))))
}

/** 画像の表示用に data URL へ変換する */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/** 長辺を MAX_SIZE 以下に縮小し、WebP（非対応なら PNG）の Blob にする */
export async function resizeScreenshot(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(MAX_SIZE / Math.max(bitmap.width, bitmap.height), 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('画像の変換に失敗しました'))),
      'image/webp',
      0.85,
    ),
  )
}
