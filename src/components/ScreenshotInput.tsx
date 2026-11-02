import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'
import { blobToDataUrl, resizeScreenshot } from '../lib/screenshots'
import { fieldLabel } from '../styles'

/** 保存前のスナップ（縮小済みの画像と、プレビュー用の URL） */
export type PendingScreenshot = { blob: Blob; preview: string }

type Props = {
  value: PendingScreenshot[]
  onChange: (update: (prev: PendingScreenshot[]) => PendingScreenshot[]) => void
}

const imageFiles = (files: FileList | null | undefined) =>
  [...(files ?? [])].filter((f) => f.type.startsWith('image/'))

/** スナップの添付欄。貼り付け・ファイル選択・ドラッグ＆ドロップに対応 */
export function ScreenshotInput({ value, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const addFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return
      setError('')
      try {
        const added = await Promise.all(
          files.map(async (file) => {
            const blob = await resizeScreenshot(file)
            return { blob, preview: await blobToDataUrl(blob) }
          }),
        )
        onChange((prev) => [...prev, ...added])
      } catch {
        setError('画像を読み込めませんでした')
      }
    },
    [onChange],
  )

  // ゲームのスクショを Ctrl+V / ⌘+V で貼り付けられるようにする
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = imageFiles(e.clipboardData?.files)
      if (files.length === 0) return
      e.preventDefault()
      addFiles(files)
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [addFiles])

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(imageFiles(e.dataTransfer.files))
  }

  return (
    <div className="mb-4">
      <span className={fieldLabel}>スナップ</span>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-field border border-dashed p-2 transition ${
          dragging ? 'border-accent bg-subtle/60' : 'border-line bg-page'
        }`}
      >
        {value.length > 0 && (
          <div className="mb-2 grid grid-cols-3 gap-2">
            {value.map((shot, i) => (
              <div
                key={i}
                className="group relative aspect-video overflow-hidden rounded-icon bg-subtle"
              >
                <img src={shot.preview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange((prev) => prev.filter((_, j) => j !== i))}
                  aria-label="このスナップを外す"
                  className="absolute right-1 top-1 rounded-control bg-ink/70 px-1.5 text-xs text-white transition focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="w-full px-2 py-3 text-xs leading-relaxed tracking-wider text-ink/70 transition hover:text-accent"
        >
          <kbd className="rounded border border-line bg-surface px-1">Ctrl</kbd>+
          <kbd className="rounded border border-line bg-surface px-1">V</kbd> で貼り付け
          <br />
          またはクリック・ドラッグで画像を追加
        </button>
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(imageFiles(e.target.files))
          e.target.value = ''
        }}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  )
}
