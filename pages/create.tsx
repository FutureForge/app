import { CreateNFT } from '@/modules/components/create'
import React from 'react'

export default function Create () {
  return (
    <div className="h-[calc(100vh-139px)] w-full flex justify-between md:px-14 px-4">
      <CreateNFT />
    </div>
  )
}
