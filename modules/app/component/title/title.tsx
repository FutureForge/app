import React from 'react'

type TitleProps = {
  title: string
  desc?: string
  className?: string
}
export function Title({title, desc, className}:TitleProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-white text-2xl font-medium">{title}</h3>
      {desc && <p className="text-muted-foreground text-sm">{desc}</p>}
    </div>
  )
}
