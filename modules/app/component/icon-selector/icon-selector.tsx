import React, { MouseEvent } from 'react'
import { ICON_TYPE } from './type'

type IconSelectorProps = {
  iconType: string | null
  className?: string
  onClick?: (event: MouseEvent) => void
}

export function Icon({ iconType, className, onClick }: IconSelectorProps) {
  let SelectedIcon = null

  if (iconType === null) return null

  for (const category in ICON_TYPE) {
    if (Object.prototype.hasOwnProperty.call(ICON_TYPE[category], iconType)) {
      SelectedIcon = ICON_TYPE[category][iconType]
      break
    }
  }

  return SelectedIcon ? <SelectedIcon onClick={onClick} className={className} /> : null
}
