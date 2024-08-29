import { ReactNode } from 'react'
import { Nav } from '../component/nav'

type RootLayoutProps = {
  children: ReactNode
  scrollToTop?: boolean
}
export const RootLayout = ({ children, scrollToTop }: RootLayoutProps) => {
  return (
    <div className="flex isolate flex-col h-screen relative bg-background">
      <Nav />
      <div
        className="w-full min-h-screen z-10"
        ref={(node) => {
          if (node && scrollToTop) {
            node.scroll(0, 0)
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}
