import { Button, Icon } from '@/modules/app'
import { client } from '@/utils/configs'
import React, { ReactNode } from 'react'
import { MediaRenderer } from 'thirdweb/react'

type CardProps = {
  src: string
  title: string
  onClick: () => void
  cta: ReactNode
}
export function Card(props: CardProps) {
  const { src, title, onClick, cta } = props
  return (
    <div className="max-w-[273px] w-full rounded-2xl max-h-[350px]">
      <div>
        <MediaRenderer
          src={'/assets/webp/1.webp'}
          client={client}
          className="rounded-tr-2xl rounded-tl-2xl"
        />
      </div>
      <div className="p-4 bg-primary">
        <p className="font-semibold">Animakid #123</p>

        <Button>
          Stake
          <Icon iconType={'coins'} className="w-4 text-white" />
        </Button>
      </div>
    </div>
  )
}
