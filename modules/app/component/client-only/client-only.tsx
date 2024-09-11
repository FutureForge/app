import React from 'react'

type ClientOnlyProps = {
  children: React.ReactNode
}

const emptySubscribe = () => () => {}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const isServer = React.useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true,
  )

  return isServer ? null : children
}
