import type { Item } from '../types'

const sizes = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-20',
}

type Props = {
  item?: Item
  size?: keyof typeof sizes
  className?: string
}

/** アイテムのアイコン。item が無いときは空の枠を表示する */
export function ItemIcon({ item, size = 'md', className = '' }: Props) {
  return (
    <div
      className={`${sizes[size]} shrink-0 overflow-hidden rounded-icon border border-subtle bg-subtle/60 ${className}`}
    >
      {item && (
        <img
          src={item.image}
          alt={item.name}
          className="size-full object-contain"
          draggable={false}
        />
      )}
    </div>
  )
}
