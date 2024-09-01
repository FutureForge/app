import Link from 'next/link'
import { Icon } from '../icon-selector/icon-selector'
import { useSearchStore } from '@/modules/stores'
import { Button } from '../button'
import { useEffect, useState } from 'react'
import { IoIosMenu } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { useDisableScroll } from '../../hooks/useDisableScroll'
import { cn } from '../../utils'
import { ConnectButton } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { chainInfo, chainInfoV2, client } from '@/utils/configs'
import { usePathname } from 'next/navigation'

const Nav_Links = [
  {
    name: 'Create',
    link: '/create',
  },
  {
    name: 'Add Collection',
    link: '/add-collection',
  },
  {
    name: 'NFT Staking',
    link: '/staking',
  },
  // {
  //   name: 'Collections',
  //   link: '/collections',
  // },
]
export function Nav() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  useDisableScroll(isMobileNavOpen)

  const { value, setValue } = useSearchStore((state) => ({
    value: state.value,
    setValue: state.setValue,
  }))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <nav
      className={cn(
        'flex sticky top-0 inset-x-0 z-50 py-3 h-20 w-full md:px-14 justify-between px-4 items-center font-inter',
        isScrolled ? 'bg-[#0F0F0F] border-b border-sec-bg' : 'bg-transparent',
      )}
    >
      <div className="flex items-center justify-between w-1/3 gap-10">
        <Link href={'/'} className="text-white font-medium flex-1 flex gap-1 items-center">
          <Icon iconType={'logo'} />
          <span className="hidden sm:block">MintMingle</span>
        </Link>

        <ul className="min-[1170px]:flex hidden items-center justify-between gap-5 w-full">
          {Nav_Links.map((item) => {
            const { name, link } = item
            const isActive = pathname === link

            return (
              <li key={name} className="flex items-center justify-between">
                <Link
                  href={link}
                  className={cn(
                    'text-muted-foreground whitespace-nowrap hover:text-foreground duration-300 ease-in-out transition',
                    { 'text-foreground': isActive },
                  )}
                >
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="lg:flex items-center hidden justify-between w-1/3 bg-primary gap-3  h-10 px-4 rounded-xl border border-primary">
        <Icon iconType={'search'} className="w-5 cursor-pointer text-[#292D32]" />

        <input
          className="h-full w-full bg-transparent outline-none text-muted-foreground caret-muted-foreground placeholder:text-muted-foreground font-medium"
          placeholder="Search NFTS"
          type="text"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="lg:w-1/6 w-1/2 flex lg:items-center justify-end lg:gap-6 gap-2 ">
        <Icon
          iconType={'profile'}
          className="w-6 text-muted-foreground max-sm:hidden cursor-pointer hover:text-foreground duration-300 ease-in-out transition"
        />

        <ConnectButton
          client={client}
          chain={chainInfo}
          wallets={[createWallet('io.metamask')]}
          connectButton={{
            label: 'Connect Wallet',
            className:
              '!font-inter !rounded-xl lg:!w-36 !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!bg-primary/65 hover:!text-foreground !duration-300 !ease-in-out !transition !bg-primary !text-muted-foreground !h-10',
          }}
        />
      </div>
      <div className="min-[1170px]:hidden flex items-center gap-8">
        {isMobileNavOpen ? (
          <IoClose
            size={30}
            onClick={() => setIsMobileNavOpen(false)}
            className="text-muted-foreground"
          />
        ) : (
          <IoIosMenu
            size={30}
            className="text-muted-foreground"
            onClick={() => setIsMobileNavOpen(true)}
          />
        )}
      </div>
      {isMobileNavOpen && <MobileNav />}
    </nav>
  )
}

function MobileNav() {
  return (
    <div className="fixed top-[64px] left-0 w-full h-screen flex flex-col items-center bg-sec-bg text-primary-foreground z-50">
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        {Nav_Links.map((item) => {
          const { name, link } = item

          return (
            <ul key={name} className="flex">
              <li className="flex">
                <Link
                  href={link}
                  className="hover:text-button-hover font-medium text-xl text-muted-foreground"
                >
                  {name}
                </Link>
              </li>
            </ul>
          )
        })}
      </div>
    </div>
  )
}
