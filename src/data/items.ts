import { PARTS, type Item, type ItemInfo, type PartKey } from '../types'

/**
 * src/assets/items/<部位>/<アイテム名>.<拡張子>
 * （種類がある部位は src/assets/items/<部位>/<種類>/<アイテム名>.<拡張子>）
 * に置いた画像を、ビルド時にすべて読み込む。
 * 画像を追加・削除すると、開発サーバーではそのまま画面に反映される。
 */
const modules = import.meta.glob<string>(
  [
    '../assets/items/*/*.{png,jpg,jpeg,webp,gif,svg}',
    '../assets/items/*/*/*.{png,jpg,jpeg,webp,gif,svg}',
  ],
  { eager: true, query: '?url', import: 'default' },
)

/** src/data/item-info/<部位>.json（キーはアイテム id）をまとめたもの */
const infoById: Record<string, ItemInfo> = Object.assign(
  {},
  ...Object.values(
    import.meta.glob<Record<string, ItemInfo>>('./item-info/*.json', {
      eager: true,
      import: 'default',
    }),
  ),
)

/** 並び順を指定するためのファイル名先頭の番号（例: "01_"）を表示名から取り除く */
const toDisplayName = (stem: string) => stem.replace(/^\d+[_-]/, '')

function toItem(path: string, url: string): Item | null {
  const match = path.match(/\/items\/([^/]+)\/(?:([^/]+)\/)?([^/]+)\.\w+$/)
  if (!match) return null
  const [, partKey, sub, stem] = match
  const part = PARTS.find((p) => p.key === partKey)
  if (!part) return null

  const subs = 'subs' in part ? part.subs : undefined
  if (subs ? !subs.some((s) => s.key === sub) : sub !== undefined) {
    console.warn(`アイテム画像の置き場所が部位の種類と合っていません: ${path}`)
    return null
  }

  // ファイル名が変わらない限り同じ id になるので、コーデにはこの id を保存する
  const id = `${partKey}/${stem}`
  return {
    id,
    part: partKey as PartKey,
    sub,
    name: toDisplayName(stem),
    image: url,
    info: infoById[id],
  }
}

export const ITEMS: Item[] = []
export const ITEMS_BY_ID = new Map<string, Item>()

for (const [path, url] of Object.entries(modules).sort(([a], [b]) =>
  a.localeCompare(b, 'ja', { numeric: true }),
)) {
  const item = toItem(path, url)
  if (!item) continue
  if (ITEMS_BY_ID.has(item.id)) {
    console.warn(`同じ部位に同名のアイテム画像があります: ${path}`)
    continue
  }
  ITEMS.push(item)
  ITEMS_BY_ID.set(item.id, item)
}
