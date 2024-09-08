import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MediaRenderer, useActiveAccount } from 'thirdweb/react'
import { Header, ProfileLayout } from '@/modules/components/profile'
import { FilterButtons } from '@/modules/components/header/components/filter'
import { useUserNFTsQuery } from '@/modules/query'
import { client } from '@/utils/configs'
import { Button, cn, Icon } from '@/modules/app'

type FilterType = 'NFTs' | 'Listed' | "Offer's Made" | 'Auction'

const filters: FilterType[] = ['NFTs', 'Listed', "Offer's Made", 'Auction']

const DATA = [
  {
    id: 1,
    type: 'NFTs',
    name: 'NFT #1',
    description: 'First NFT description',
    imageUrl: '/Image.png',
    icon: true,
  },
  {
    id: 2,
    type: 'NFTs',
    name: 'NFT #2',
    description: 'Second NFT description',
    imageUrl: '/Image.png',
    icon: true,
  },

  {
    id: 3,
    type: 'Listed',
    name: 'Listed NFT #1',
    description: 'Listed NFT description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Price',
        value: '1.63 XFI',
      },
      {
        label: 'No of Offers',
        value: '300',
      },
    ],
  },
  {
    id: 4,
    type: 'Listed',
    name: 'Listed NFT #2',
    description: 'Second listed NFT description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Price',
        value: '1.63 XFI',
      },
      {
        label: 'No of Offers',
        value: '300',
      },
    ],
  },

  {
    id: 5,
    type: "Offer's Made",
    name: 'Offer #1',
    description: 'First offer made description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Price',
        value: '1.63 XFI',
      },
      {
        label: 'No of Offers',
        value: '300',
      },
    ],
  },
  {
    id: 6,
    type: "Offer's Made",
    name: 'Offer #2',
    description: 'Second offer made description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Price',
        value: '1.63 XFI',
      },
      {
        label: 'No of Offers',
        value: '300',
      },
    ],
  },

  {
    id: 7,
    type: 'Auction',
    name: 'Auction NFT #1',
    description: 'Auctioned NFT description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Buy Out Price',
        value: '1.63 XFI',
      },
      {
        label: 'Min Price',
        value: '1.63 XFI',
      },

      {
        label: 'Current Bid',
        value: '1.63 XFI',
      },
    ],
  },
  {
    id: 8,
    type: 'Auction',
    name: 'Auction NFT #2',
    description: 'Second auctioned NFT description',
    imageUrl: '/Image.png',
    icon: false,
    details: [
      {
        label: 'Buy Out Price',
        value: '1.63 XFI',
      },
      {
        label: 'Min Price',
        value: '1.63 XFI',
      },

      {
        label: 'Current Bid',
        value: '1.63 XFI',
      },
    ],
  },
]
export default function UserProfile() {
  const router = useRouter()
  const activeAccount = useActiveAccount()
  const [filter, setFilter] = useState<FilterType>('NFTs')

  const { data } = useUserNFTsQuery()

  const filteredData = DATA.filter((item) => item.type === filter)

  useEffect(() => {
    if (!activeAccount) {
      router.push('/')
    }
  }, [activeAccount, router])

  const getCtaAndOnClick = (item: (typeof DATA)[0]) => {
    let ctaText = ''
    let icon = false
    let handleClick = () => {}

    switch (item.type) {
      case 'NFTs':
        icon = true
        ctaText = 'List / Auction'
        handleClick = () => console.log(`Viewing ${item.name}`)
        break
      case 'Listed':
        ctaText = 'Cancel Listing'
        handleClick = () => console.log(`Unlisting ${item.name}`)
        break
      case "Offer's Made":
        ctaText = 'Cancel Offers'
        handleClick = () => console.log(`Canceling offer for ${item.name}`)
        break
      case 'Auction':
        ctaText = 'Cancel Auction'
        handleClick = () => console.log(`Placing bid on ${item.name}`)
        break
      default:
        ctaText = 'Action'
        handleClick = () => console.log(`Performing action on ${item.name}`)
        break
    }

    return { ctaText, handleClick, icon }
  }

  return activeAccount ? (
    <div className="md:px-14 px-4 flex flex-col max-xsm:items-center gap-8 relative w-full h-full">
      <Header />
      <div className="lg:ml-52 z-50 max-md:mt-10 max-w-[90%]">
        <FilterButtons className="z-50" filter={filter} setFilter={setFilter} filters={filters} />
      </div>
      <div className="flex items-center justify-center">
        {/* {!data || data.length === 0 ? (
          <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
            <p className="font-medium">
              You don&apos;t own any MINT MINGLE COLLECTION NFT NFT try buying one
            </p>
          </div>
        ) : ( */}
          <div className="w-full grid py-10 place-content-center grid-cols-4 gap-7 gap-y-10 2xl:grid-cols-6 max-lg:grid-cols-3 max-xsm:grid-cols-1 max-md:grid-cols-2">
            {filteredData?.map((item) => {
              const { ctaText, handleClick, icon } = getCtaAndOnClick(item)
              return (
                <Card
                  key={item.id}
                  title={item.name}
                  src={item.imageUrl}
                  cta={ctaText}
                  onClick={handleClick}
                  icon={icon}
                  details={item.details}
                />
              )
            })}
          </div>
        {/* )} */}
      </div>
    </div>
  ) : null
}

type Detail = {
  label: string
  value: string
}
type CardProps = {
  src: string | undefined
  title: string | undefined
  onClick?: () => void
  cta?: string
  icon?: boolean
  tokenId?: string
  disabled?: boolean
  details?: Detail[]
}
function Card(props: CardProps) {
  const { src, title, onClick, cta, tokenId, disabled, icon, details } = props

  return (
    <div className="max-w-[275px] w-full rounded-2xl max-h-[405px]">
      <div>
        <MediaRenderer src={src} client={client} className="rounded-tr-2xl rounded-tl-2xl" />
      </div>
      <div className="p-4 bg-primary rounded-br-2xl rounded-bl-2xl">
        <p className={cn("font-semibold", {'pb-3':details})}>{title}</p>
        {details && (
          <div className="w-full border-t border-t-white/25 pt-3 flex items-center justify-between">
            {details.map((detail, index) => {
              const { label, value } = detail

              return (
                <div key={index} className='flex flex-col gap-2'>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xm text-foreground font-semibold">{value}</p>
                </div>
              )
            })}
          </div>
        )}
        <Button
          disabled={disabled}
          onClick={onClick}
          variant="secondary"
          className="h-10 mt-3 flex items-center gap-3"
        >
          {cta}
          {icon && <Icon iconType={'cart'} className="w-4 text-white" />}
        </Button>
      </div>
    </div>
  )
}

UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>
}
