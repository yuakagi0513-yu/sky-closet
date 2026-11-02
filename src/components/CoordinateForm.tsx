import { useState, type FormEvent } from 'react'
import { ITEMS } from '../data/items'
import { deleteScreenshots, saveScreenshot } from '../lib/screenshots'
import { fieldLabel, panel, inputClass, primaryButton } from '../styles'
import {
  PARTS,
  type Coordinate,
  type ItemSelection,
  type PartKey,
} from '../types'
import { ItemPicker } from './ItemPicker'
import { ScreenshotInput, type PendingScreenshot } from './ScreenshotInput'

type Props = {
  onSubmit: (input: Omit<Coordinate, 'id' | 'createdAt'>) => void
}

export function CoordinateForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [selection, setSelection] = useState<ItemSelection>({})
  const [memo, setMemo] = useState('')
  const [openPart, setOpenPart] = useState<PartKey | null>(null)
  const [screenshots, setScreenshots] = useState<PendingScreenshot[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const select = (key: PartKey, id: string | undefined) => {
    setSelection((prev) => ({ ...prev, [key]: id }))
    setOpenPart(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || saving) return
    setSaving(true)
    setError('')
    const screenshotIds: string[] = []
    try {
      for (const { blob } of screenshots) screenshotIds.push(await saveScreenshot(blob))
    } catch {
      // 途中まで保存できた分は残さない
      deleteScreenshots(screenshotIds).catch(() => {})
      setError('スナップの保存に失敗しました。ブラウザの空き容量を確認してください')
      setSaving(false)
      return
    }
    onSubmit({
      name: name.trim(),
      items: selection,
      memo: memo.trim(),
      ...(screenshotIds.length > 0 && { screenshotIds }),
    })
    setName('')
    setSelection({})
    setMemo('')
    setScreenshots([])
    setOpenPart(null)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className={`${panel} p-6`}>
      <label className="mb-4 block">
        <span className={fieldLabel}>
          コーデ名 <span className="text-accent">*</span>
        </span>
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 孤島の夕暮れ"
          required
        />
      </label>

      <ScreenshotInput value={screenshots} onChange={setScreenshots} />

      <span className={fieldLabel}>アイテム</span>
      <div className="mb-4 divide-y divide-subtle border-y border-subtle">
        {PARTS.map((part) => (
          <ItemPicker
            key={part.key}
            part={part}
            items={ITEMS.filter((item) => item.part === part.key)}
            selectedId={selection[part.key]}
            open={openPart === part.key}
            onToggle={() =>
              setOpenPart((prev) => (prev === part.key ? null : part.key))
            }
            onSelect={(id) => select(part.key, id)}
          />
        ))}
      </div>

      <label className="mb-5 block">
        <span className={fieldLabel}>メモ</span>
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="合わせたい季節や気分など"
        />
      </label>

      {error && <p className="mb-3 text-xs text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={!name.trim() || saving}
        className={primaryButton}
      >
        {saving ? '保存中…' : '保存する'}
      </button>
    </form>
  )
}
