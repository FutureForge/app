import { CreateNFT } from '@/modules/components/create'
import React from 'react'

export default function Create () {
  return (
    <div className="h-[calc(100vh-139px)] w-full flex justify-center md:px-14 px-4 max-w-[1464px] container mx-auto">
      <CreateNFT />
    </div>
  )
}
