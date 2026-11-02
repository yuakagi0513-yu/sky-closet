export type SubPart = { key: string; label: string }

export type Part = {
  key: string
  label: string
  /** 部位の中の種類。画像は src/assets/items/<部位>/<種類>/ に置く */
  subs?: readonly SubPart[]
}

export const PARTS = [
  { key: 'hair', label: 'ヘアスタイル' },
  { key: 'hair-accessory', label: 'ヘアアクセサリー' },
  { key: 'head-accessory', label: 'ヘッドアクセサリー' },
  { key: 'mask', label: 'マスク' },
  { key: 'face-accessory', label: 'フェイスアクセサリー' },
  { key: 'necklace', label: 'ネックレス' },
  { key: 'cape', label: 'ケープ' },
  {
    key: 'outfit',
    label: 'パンツ',
    subs: [
      { key: 'no-shoes', label: 'パンツ（靴なし）' },
      { key: 'shoes', label: 'パンツ（靴あり）' },
    ],
  },
  { key: 'shoes', label: 'シューズ' },
  {
    key: 'prop',
    label: '持ち歩きアイテム',
    subs: [
      { key: 'instrument', label: '楽器' },
      { key: 'large', label: '大きい持ち物' },
      { key: 'small', label: '小さい持ち物' },
    ],
  },
] as const satisfies readonly Part[]

export type PartKey = (typeof PARTS)[number]['key']

export const findPart = (key: PartKey): Part =>
  PARTS.find((p) => p.key === key)!

/** src/assets/items に同梱した 1 アイテム */
export type Item = {
  /**
   * "<部位>/<ファイル名(拡張子なし)>"。種類のフォルダ名は含めないので、
   * 種類を移し替えても id は変わらない
   */
  id: string
  part: PartKey
  /** 部位に種類がある場合の種類のキー */
  sub?: string
  name: string
  /** アイコン画像の URL */
  image: string
  /** src/data/item-info/<部位>.json に記載がある場合のみ */
  info?: ItemInfo
}

/** 検索・絞り込み用のアイテム情報 */
export type ItemInfo = {
  /** 衣装が靴ありかどうか */
  shoes?: boolean
  /** 恒常 / 限定 / 復刻なし */
  availability?: string
  /** 交換 / 販売 / 究極 / クエスト報酬 */
  method?: string
  /** 入手元の精霊・イベント名 */
  source?: string
  sourceUrl?: string
  season?: string
  /** 必要なハート数や価格（例: "ハート3", "650円"） */
  cost?: string
  /** 持ち物の効果（例: "雨から身を守ることができる"） */
  effect?: string
  /** 染色できるか（不明なら null） */
  dyeable?: boolean | null
  /** 取り込み元の画像 URL */
  iconUrl?: string
}

/** 部位ごとに選んだアイテムの id */
export type ItemSelection = Partial<Record<PartKey, string>>

export type Coordinate = {
  id: string
  name: string
  items: ItemSelection
  memo: string
  /** 添付したスナップの id（画像本体は IndexedDB） */
  screenshotIds?: string[]
  createdAt: number
  /** アイコン選択方式になる前に、テキストで登録したコーデの部位 */
  legacyParts?: Partial<Record<PartKey, string>>
}
