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
        className="w-full z-10 py-6 font-inter"
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
