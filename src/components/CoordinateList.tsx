import { ITEMS_BY_ID } from '../data/items'
import { panel } from '../styles'
import { PARTS, type Coordinate } from '../types'
import { ItemIcon } from './ItemIcon'

type Props = {
  coordinates: Coordinate[]
  onDelete: (id: string) => void
}

export function CoordinateList({ coordinates, onDelete }: Props) {
  if (coordinates.length === 0) {
    return (
      <div className="rounded-panel bg-subtle/60 px-6 py-14 text-center text-sm leading-loose tracking-wider text-ink/70">
        まだコーデがありません。
        <br />
        お気に入りの組み合わせを登録してみましょう。
      </div>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {coordinates.map((c) => (
        <li key={c.id} className={`${panel} flex flex-col overflow-hidden`}>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-4 flex items-start justify-between gap-2 border-b border-subtle pb-3">
              <h3 className="text-base tracking-wider text-ink">{c.name}</h3>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`「${c.name}」を削除しますか？`)) onDelete(c.id)
                }}
                className="shrink-0 rounded-control px-2 py-0.5 text-[11px] tracking-wider text-ink/40 transition hover:text-rose-500"
              >
                削除
              </button>
            </div>

            <ul className="grid grid-cols-3 gap-2">
              {PARTS.map((part) => {
                const itemId = c.items[part.key]
                const item = itemId ? ITEMS_BY_ID.get(itemId) : undefined
                const legacyText = c.legacyParts?.[part.key]
                const caption = item
                  ? item.name
                  : itemId
                    ? '削除済み'
                    : legacyText || '—'
                const label =
                  ('subs' in part &&
                    part.subs.find((s) => s.key === item?.sub)?.label) ||
                  part.label
                return (
                  <li
                    key={part.key}
                    className="flex flex-col items-center gap-1"
                    title={`${label}: ${caption}`}
                  >
                    <ItemIcon item={item} />
                    <span className="w-full truncate text-center text-[10px] text-ink/50">
                      {label}
                    </span>
                    <span
                      className={`w-full truncate text-center text-xs ${
                        item ? 'text-ink/90' : 'text-ink/50'
                      }`}
                    >
                      {caption}
                    </span>
                  </li>
                )
              })}
            </ul>

            {c.memo && (
              <p className="mt-4 whitespace-pre-wrap bg-page px-3 py-2 text-xs leading-relaxed text-ink/80">
                {c.memo}
              </p>
            )}

            <p className="display-heading mt-auto pt-3 text-right text-xs text-accent">
              {new Date(c.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
