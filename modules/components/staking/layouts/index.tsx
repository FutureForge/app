import { Tabs } from '@/modules/app'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const NAV_LINKS = [
  {
    title: 'Staking',
    href: '/staking',
  },
  {
    title: 'Withdraw',
    href: '/staking/withdraw',
  },
  {
    title: 'Claim Rewards',
    href: '/staking/rewards',
  },
]

type StakingLayoutProps = {
  children: ReactNode
}

export function StakingLayout({ children }: StakingLayoutProps) {
  const pathname = usePathname()
  return (
    <div className="md:px-14 px-4 flex flex-col gap-8 relative w-full">
      <div className="flex w-full items-center justify-center fixed z-10 left-1/2 transform -translate-x-1/2">
        <Tabs
          defaultTabIndex={NAV_LINKS.findIndex((link) => pathname === link.href)}
          links={NAV_LINKS}
        />
      </div>
      <div className="w-full pt-28">{children}</div>
    </div>
  )
}
