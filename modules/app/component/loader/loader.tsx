import Image from 'next/image'
import React from 'react'
import { cn } from '../../utils'

type LoaderProps ={
  className?: string
}
export const Loader = ({className}: LoaderProps) => {
  return (
    <div className={cn("loader-container", className)}>
      <Image src={'/logo.svg'} alt="logo" width={50} height={50} className="pulsating-logo" />
    </div>
  )
}
