import Link from 'next/link'
import { Icon } from '../icon-selector/icon-selector'
import { useSearchStore } from '@/modules/stores'
import { useEffect, useState, useMemo } from 'react'
import { IoIosMenu } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { useDisableScroll } from '../../hooks/useDisableScroll'
import { cn } from '../../utils'
import { ConnectButton, MediaRenderer, useActiveAccount } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { chainInfo, client } from '@/utils/configs'
import { usePathname, useRouter } from 'next/navigation'
import {
  useGetGlobalListingOrAuctionQuery,
  useGetMarketplaceCollectionsQuery,
} from '@/modules/query'
import { ICollection } from '@/utils/models'
import { NFT } from 'thirdweb'
import { NewAuction, NewListing } from '@/modules/components/header/types/types'

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
  {
    name: 'Swap',
    link: '/swap',
  },
  // {
  //   name: 'Collections',
  //   link: '/collections',
  // },
]

type MarketplaceCollectionType = {
  collection: ICollection
  floorPrice: string
  totalVolume: number
  nfts: NFT[]
}

export function Nav() {
  const marketplaceCollection = useGetMarketplaceCollectionsQuery()
  const { data: global } = useGetGlobalListingOrAuctionQuery()

  const marketplaceCollectionData: MarketplaceCollectionType[] = marketplaceCollection?.data
  const allAuction: NewAuction[] = global?.allAuction
  const allListing: NewListing[] = global?.allListing

  const activeAccount = useActiveAccount()
  const router = useRouter()

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const pathname = usePathname()


  useDisableScroll(isMobileNavOpen)

  const { value, setValue } = useSearchStore((state) => ({
    value: state.value,
    setValue: state.setValue,
  }))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setIsSearching(true)
    setShowResults(true)
  }
  const handleClick = () => {
    if (activeAccount) {
      router.push('/user-profile') 
    } else {
      router.push('/') 
    }
  }
  const clearSearch = () => {
    setValue('')
    setShowResults(false)
  }

  const searchResults = useMemo(() => {
    setIsSearching(true)
    if (!value) {
      setIsSearching(false)
      return []
    }

    const results = new Map()

    // Search in global.allAuction
    allAuction?.forEach((auction) => {
      if (auction?.nft?.metadata?.name?.toLowerCase().includes(value.toLowerCase())) {
        results.set(auction.nft.metadata.name.toLowerCase(), { ...auction, type: 'auction' })
      }
    })

    // Search in global.allListed
    allListing?.forEach((listing) => {
      if (listing?.nft?.metadata?.name?.toLowerCase().includes(value.toLowerCase())) {
        results.set(listing.nft.metadata.name.toLowerCase(), { ...listing, type: 'direct_listing' })
      }
    })

    // Search in marketplaceCollection
    marketplaceCollectionData?.forEach((item) => {
      if (item.collection.name.toLowerCase().includes(value.toLowerCase())) {
        if (!results.has(item.collection.name.toLowerCase())) {
          results.set(item.collection.name.toLowerCase(), { ...item, type: 'collection' })
        }
      }
      item.nfts?.forEach((nft) => {
        if (nft?.metadata?.name?.toLowerCase().includes(value.toLowerCase())) {
          if (!results.has(nft.metadata.name.toLowerCase())) {
            results.set(nft.metadata.name.toLowerCase(), {
              ...nft,
              type: 'collection_nft',
              collectionName: item.collection.name,
              assetContract: item.collection.collectionContractAddress,
            })
          }
        }
      })
    })

    setIsSearching(false)
    return Array.from(results.values())
  }, [value, marketplaceCollectionData, allAuction, allListing])

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
        'flex sticky top-0 inset-x-0 z-50 py-3 h-20 w-full md:px-14 px-4 justify-between items-center font-inter',
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
      <div className="lg:flex items-center hidden justify-between w-1/3 bg-primary gap-3  h-10 px-4 rounded-xl border border-primary relative">
        <Icon iconType={'search'} className="w-5 cursor-pointer text-[#292D32]" />

        <input
          className="h-full w-full bg-transparent outline-none text-muted-foreground caret-muted-foreground placeholder:text-muted-foreground font-medium"
          placeholder="Search NFTS"
          type="text"
          value={value}
          onChange={handleChange}
        />

        {showResults && value && (
          <div className="absolute top-full left-0 w-full mt-2 bg-black rounded-xl shadow-lg max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-white text-center">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Link
                  href={
                    result.type === 'collection'
                      ? ``
                      : `/nft/${result.assetContract}/CFC-721/${
                          result.tokenId || result.id || result.nft?.id
                        }`
                  }
                  key={index}
                  className="p-2 hover:bg-gray-800 flex items-center"
                  onClick={clearSearch}
                >
                  <MediaRenderer
                    client={client}
                    src={
                      result.nft?.metadata?.image ||
                      result.metadata?.image ||
                      result.collection?.image ||
                      '/logo.svg'
                    }
                    className="rounded-2xl mr-2"
                    style={{ maxHeight: '40px', width: '40px', height: '40px' }}
                  />
                  <div className="flex flex-col">
                    <span className="text-white">
                      {result.collection?.name ||
                        result.nfts?.name ||
                        result.metadata?.name ||
                        result?.nft?.metadata?.name}
                    </span>
                    <span className={`text-xs font-semibold ${getTagColor(result.type)}`}>
                      {getTagText(result.type, result.collectionName)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-white text-center">No results found</div>
            )}
          </div>
        )}
      </div>
      <div className="lg:w-1/5 w-1/2 flex lg:items-center justify-end lg:gap-6 gap-2 ">
        <Icon
          iconType={'profile'}
          onClick={handleClick}
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

function getTagText(type: string, collectionName?: string) {
  switch (type) {
    case 'collection':
      return 'Collection'
    case 'collection_nft':
      return `NFT in ${collectionName}`
    case 'auction':
      return 'Live Auction'
    case 'direct_listing':
      return 'Direct Sale'
    default:
      return ''
  }
}

function getTagColor(type: string) {
  switch (type) {
    case 'collection':
      return 'text-blue-400'
    case 'collection_nft':
      return 'text-green-400'
    case 'auction':
      return 'text-purple-400'
    case 'direct_listing':
      return 'text-yellow-400'
    default:
      return 'text-gray-400'
  }
}
