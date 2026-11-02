import { useState, type FormEvent } from 'react'
import { ITEMS } from '../data/items'
import { fieldLabel, panel, inputClass, primaryButton } from '../styles'
import {
  PARTS,
  type Coordinate,
  type ItemSelection,
  type PartKey,
} from '../types'
import { ItemPicker } from './ItemPicker'

type Props = {
  onSubmit: (input: Omit<Coordinate, 'id' | 'createdAt'>) => void
}

export function CoordinateForm({ onSubmit }: Props) {
  const [name, setName] = useState('')
  const [selection, setSelection] = useState<ItemSelection>({})
  const [memo, setMemo] = useState('')
  const [openPart, setOpenPart] = useState<PartKey | null>(null)

  const select = (key: PartKey, id: string | undefined) => {
    setSelection((prev) => ({ ...prev, [key]: id }))
    setOpenPart(null)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), items: selection, memo: memo.trim() })
    setName('')
    setSelection({})
    setMemo('')
    setOpenPart(null)
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

      <button
        type="submit"
        disabled={!name.trim()}
        className={primaryButton}
      >
        保存する
      </button>
    </form>
  )
}
