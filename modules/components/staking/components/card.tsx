import { Button, Icon } from '@/modules/app'
import { client } from '@/utils/configs'
import React, { ReactNode } from 'react'
import { MediaRenderer } from 'thirdweb/react'

type CardProps = {
  src: string | undefined
  title: string | undefined
  onClick: (tokenId: string) => void
  cta: ReactNode
  tokenId: string
  disabled: boolean
}
export function Card(props: CardProps) {
  const { src, title, onClick, cta, tokenId, disabled } = props

  return (
    <div className="max-w-[273px] w-full rounded-2xl max-h-[350px]">
      <div>
        <MediaRenderer src={src} client={client} className="rounded-tr-2xl rounded-tl-2xl" />
      </div>
      <div className="p-4 bg-primary rounded-br-2xl rounded-bl-2xl">
        <p className="font-semibold">{title}</p>

        <Button
          disabled={disabled}
          onClick={() => onClick(tokenId)}
          variant="secondary"
          className="h-10 mt-3"
        >
          {cta}
        </Button>
      </div>
    </div>
  )
}
