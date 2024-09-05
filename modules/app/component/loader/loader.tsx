import Image from 'next/image'
import React from 'react'

export const Loader = () => {
  return (
    <div className="loader-container">
      <Image src={'/logo.svg'} alt="logo" width={50} height={50} className="pulsating-logo" />
    </div>
  )
}
