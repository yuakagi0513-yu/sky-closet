import { useEffect, useState } from 'react'
import { useScreenshotUrl } from '../hooks/useScreenshotUrl'

type Props = {
  ids: string[]
  alt: string
}

/** コーデカード上部のスナップ。クリックで拡大表示する */
export function ScreenshotGallery({ ids, alt }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenIndex(0)}
        className="relative block aspect-video w-full overflow-hidden bg-subtle"
        aria-label={`${alt}のスナップを拡大`}
      >
        <ScreenshotImage id={ids[0]} alt={alt} className="size-full object-cover" />
        {ids.length > 1 && (
          <span className="display-heading absolute bottom-2 right-2 rounded-control bg-ink/60 px-2 py-0.5 text-xs tracking-wider text-white">
            +{ids.length - 1}
          </span>
        )}
      </button>

      {openIndex !== null && (
        <Lightbox
          ids={ids}
          index={openIndex}
          alt={alt}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}

function ScreenshotImage({
  id,
  alt,
  className,
}: {
  id: string
  alt: string
  className?: string
}) {
  const url = useScreenshotUrl(id)
  return url ? <img src={url} alt={alt} className={className} /> : null
}

type LightboxProps = {
  ids: string[]
  index: number
  alt: string
  onChange: (index: number) => void
  onClose: () => void
}

function Lightbox({ ids, index, alt, onChange, onClose }: LightboxProps) {
  const prev = () => onChange((index - 1 + ids.length) % ids.length)
  const next = () => onChange((index + 1) % ids.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const navButton =
    'absolute top-1/2 -translate-y-1/2 rounded-control bg-page/20 px-3 py-2 text-xl text-white transition hover:bg-accent'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt}のスナップ`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
    >
      <div onClick={(e) => e.stopPropagation()} className="relative">
        <ScreenshotImage
          id={ids[index]}
          alt={alt}
          className="max-h-[85vh] max-w-[90vw] rounded-panel"
        />
        {ids.length > 1 && (
          <>
            <button type="button" onClick={prev} className={`${navButton} left-2`} aria-label="前の画像">
              ‹
            </button>
            <button type="button" onClick={next} className={`${navButton} right-2`} aria-label="次の画像">
              ›
            </button>
            <p className="display-heading mt-2 text-center text-sm text-white/80">
              {index + 1} / {ids.length}
            </p>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className="absolute right-4 top-4 rounded-control bg-page/20 px-3 py-1 text-white transition hover:bg-accent"
      >
        ✕
      </button>
    </div>
  )
}
