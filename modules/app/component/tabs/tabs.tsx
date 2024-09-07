import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
import { cn } from '../../utils'

type TabProps = {
  children: ReactNode
  onClick?: () => void
  href: string
  isActive: boolean
  className?: string
}

const Tab = ({ children, href, isActive, onClick, className }: TabProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'h-full flex font-sans relative items-center font-medium justify-center px-4 text-muted-foreground border-new-border duration-200 ease-out',
        className,
        {
          'text-foreground bg-sec-bg rounded-xl': isActive,
          'hover:text-foreground rounded-xl': !isActive,
        },
      )}
    >
      {children}
    </Link>
  )
}


type LinkType = {
  title: string
  href: string
  disabled?: boolean
}

type TabsProps = {
  links: LinkType[]
  defaultTabIndex?: number
}

export const Tabs = ({ links, defaultTabIndex = 0 }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTabIndex)

  return (
    <div className=" w-fit flex p-2.5 mt-2.5 h-14 relative bg-[#0F0F0F] border border-[#1B1F26B8] rounded-[16px]">
      <LayoutGroup>
        {links.map((link, i) => (
          <Tab key={i} onClick={() => setActiveTab(i)} href={link.href} isActive={activeTab === i}>
            {link.title}
          </Tab>
        ))}
      </LayoutGroup>
    </div>
  )
}
