type Props = {
  /** セクション番号（例: "01"） */
  no: string
  /** 英字の見出し */
  en: string
  /** 日本語の補足 */
  ja: string
  /** 見出しの右側に添える内容（件数など） */
  aside?: React.ReactNode
}

/** 「01. NEW COORDINATE」のような番号付きの見出し */
export function SectionTitle({ no, en, ja, aside }: Props) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3 border-b border-line pb-3">
      <h2 className="flex items-baseline gap-3">
        <span className="display-heading text-3xl text-accent">
          {no}.
        </span>
        <span>
          <span className="display-heading block text-xl text-ink uppercase">
            {en}
          </span>
          <span className="block text-[11px] tracking-widest text-ink/60">
            {ja}
          </span>
        </span>
      </h2>
      {aside}
    </div>
  )
}
