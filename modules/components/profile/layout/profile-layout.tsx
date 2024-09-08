import { Nav } from "@/modules/app"
import dynamic from "next/dynamic"
import { ReactNode } from "react"

type ProfileLayoutProps = {
  children: ReactNode
  scrollToTop?: boolean
}

const Toast = dynamic(() => import('@/modules/components/toast/toast'), { ssr: false })
export function ProfileLayout({ children, scrollToTop }: ProfileLayoutProps) {
  return (
    <div className="flex isolate flex-col h-screen relative bg-background">
      <Nav />
      <div
        className="w-full z-10 font-inter"
        ref={(node) => {
          if (node && scrollToTop) {
            node.scroll(0, 0)
          }
        }}
      >
        {children}
        <Toast />
      </div>
    </div>
  )
}