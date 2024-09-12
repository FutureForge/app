// import React from 'react'

// type ClientOnlyProps = {
//   children: React.ReactNode
// }

// const emptySubscribe = () => () => {}

// export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
//   const isServer = React.useSyncExternalStore(
//     emptySubscribe,
//     () => false,
//     () => true,
//   )

//   return isServer ? null : children
// }
import React, { useState, useEffect } from 'react'

type ClientOnlyProps = {
  children: React.ReactNode
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <>{children}</>
}
