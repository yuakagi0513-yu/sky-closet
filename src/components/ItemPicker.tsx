import { useState } from 'react'
import { chipActive, chipInactive } from '../styles'
import type { Item, Part } from '../types'
import { ItemIcon } from './ItemIcon'

type Props = {
  part: Part
  items: Item[]
  selectedId?: string
  open: boolean
  onToggle: () => void
  onSelect: (id: string | undefined) => void
}

/** 1 部位ぶんのアイコン選択欄。種類がある部位はタブで切り替える */
export function ItemPicker({
  part,
  items,
  selectedId,
  open,
  onToggle,
  onSelect,
}: Props) {
  const selected = items.find((item) => item.id === selectedId)
  const subs = part.subs
  const [activeSub, setActiveSub] = useState(selected?.sub ?? subs?.[0].key)
  const visibleItems = subs
    ? items.filter((item) => item.sub === activeSub)
    : items
  const selectedSubLabel = subs?.find((s) => s.key === selected?.sub)?.label

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (!open && selected?.sub) setActiveSub(selected.sub)
          onToggle()
        }}
        className="flex w-full items-center gap-3 rounded-field px-1 py-2 text-left transition hover:bg-page"
      >
        <ItemIcon item={selected} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] tracking-wider text-ink/60">
            {part.label}
            {selectedSubLabel && (
              <span className="text-ink/50"> · {selectedSubLabel}</span>
            )}
          </span>
          <span className="block truncate text-sm text-ink">
            {selected?.name ?? <span className="text-ink/40">未選択</span>}
          </span>
        </span>
        <span className={`pr-1 text-xs text-accent transition ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="mb-2 rounded-field bg-page p-2">
          {subs && (
            <div className="mb-2 flex flex-wrap gap-1">
              {subs.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveSub(s.key)}
                  className={`rounded-control px-3 py-1 text-xs tracking-wider transition ${
                    activeSub === s.key ? chipActive : chipInactive
                  }`}
                >
                  {s.label}
                  <span className="ml-1 opacity-70">
                    {items.filter((item) => item.sub === s.key).length}
                  </span>
                </button>
              ))}
            </div>
          )}

          {visibleItems.length === 0 ? (
            <p className="px-1 py-2 text-xs text-ink/70">
              この項目のアイテムがありません。
              src/assets/items/ に画像を追加してください。
            </p>
          ) : (
            <div className="flex max-h-72 flex-wrap gap-1.5 overflow-y-auto p-0.5">
              <button
                type="button"
                onClick={() => onSelect(undefined)}
                title="なし"
                className={`flex size-14 items-center justify-center rounded-icon border border-subtle bg-surface text-xs text-ink/50 transition hover:border-accent ${
                  !selectedId ? 'ring-2 ring-accent' : ''
                }`}
              >
                なし
              </button>
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  title={item.name}
                  className="rounded-icon transition hover:opacity-80"
                >
                  <ItemIcon
                    item={item}
                    className={item.id === selectedId ? 'ring-2 ring-accent' : ''}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
