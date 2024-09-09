import { act, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { MediaRenderer, useActiveAccount } from 'thirdweb/react'
import { Header, ProfileLayout } from '@/modules/components/profile'
import { FilterButtons } from '@/modules/components/header/components/filter'
import {
  useUserAuctionQuery,
  useUserChainInfo,
  useUserListingQuery,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useCheckApprovedForAllQuery,
} from '@/modules/query'
import { client } from '@/utils/configs'
import { Button, cn, Icon, Loader } from '@/modules/app'
import { decimalOffChain } from '@/modules/blockchain'
import { useToast } from '@/modules/app/hooks/useToast'
import {
  useApprovedForAllMutation,
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCancelOfferMutation,
  useCreateAuctionMutation,
  useCreateListingMutation,
} from '@/modules/mutation'
import { Dialog } from '@/modules/app/component/dialog'
import { NFTDialog } from '@/modules/components/nft-details'
import { NFT } from 'thirdweb'
import Link from 'next/link'

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

type NFTSelectedItem = {
  address: string
  balance: string
  blockNumber: number
  contractAddress: string
  decimals: number | null
  nft: NFT
  timestamp: string
  tokenIds: string[]
  tokenName: string
  tokenSymbol: string
  tokenType: string
  type: 'NFTs' | 'Listed' | "Offer's Made" | 'Auction' // Assuming these are the possible types
}

export default function UserProfile() {
  const router = useRouter()
  const toast = useToast()
  const { activeAccount, activeWallet } = useUserChainInfo()
  const address = activeAccount?.address
  const chain = activeWallet?.getChain()

  const [filter, setFilter] = useState<FilterType>('NFTs')
  const [selectedNFT, setSelectedNFT] = useState<NFTSelectedItem | null>(null)
  const [value, setValue] = useState('')
  const [buyOutAmount, setBuyOutAmount] = useState<string | undefined>(undefined)
  const [endTimestamp, setEndTimestamp] = useState<Date | undefined>(undefined)
  // const [contractAddress, setContractAddress] = useState<string | undefined>(undefined)

  const { data: userNFTS, isLoading: userNFTLoading, isError: userNFTError } = useUserNFTsQuery()
  const {
    data: userOffersMade,
    isLoading: userOffersMadeLoading,
    isError: userOffersError,
  } = useUserOffersMadeQuery()
  const {
    data: userListing,
    isLoading: userListingLoading,
    isError: userListingError,
  } = useUserListingQuery()
  const {
    data: userAuction,
    isLoading: userAuctionLoading,
    isError: userAuctionError,
  } = useUserAuctionQuery()

  console.log({ userNFTS })

  const isLoading =
    userNFTLoading || userOffersMadeLoading || userListingLoading || userAuctionLoading
  const isError = userNFTError || userOffersError || userListingError || userAuctionError

  const allData = [
    ...(userNFTS || []),
    ...(userOffersMade || []),
    ...(userListing || []),
    ...(userAuction || []),
  ]
  const filteredData = allData.filter((item) => item.type === filter)

  const cancelDirectListingMutation = useCancelDirectListingMutation()
  const cancelOfferMutation = useCancelOfferMutation()
  const cancelAuctionMutation = useCancelAuctionMutation()
  const createListingMutation = useCreateListingMutation()
  const createAuctionMutation = useCreateAuctionMutation()
  const approvedForAllMutation = useApprovedForAllMutation()

  const isTxPending =
    cancelAuctionMutation.isPending ||
    cancelOfferMutation.isPending ||
    createAuctionMutation.isPending ||
    createListingMutation.isPending ||
    cancelDirectListingMutation.isPending ||
    approvedForAllMutation.isPending

  const handleCancelDirectListing = (listingId: string) => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')

    cancelDirectListingMutation.mutate({ listingId })
  }

  const handleCancelOffer = (offerId: string) => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')

    cancelOfferMutation.mutate({ offerId })
  }

  const handleCancelAuction = (auctionId: string) => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')

    cancelAuctionMutation.mutate({ auctionId })
  }

  const handleCreateListing = async () => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')
    if (!value) return toast.error('Please enter a valid listing amount.')
    if (!endTimestamp) return toast.error('Please select an end date')
    if (!selectedNFT) return toast.error('Please select an NFT')

    const contractAddress = selectedNFT?.contractAddress
    const tokenId = selectedNFT?.nft?.id

    createListingMutation.mutate(
      {
        directListing: {
          assetContract: contractAddress as string,
          tokenId: tokenId?.toString(),
          quantity: '1',
          pricePerToken: value,
          endTimestamp: endTimestamp,
        },
      },
      {
        onSuccess: (data: any) => {
          setValue('')
          setSelectedNFT(null)
        },
        onError: (error: any) => {
          setValue('')
          setSelectedNFT(null)
        },
      },
    )
  }

  const handleCreateAuction = async () => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')
    if (!value) return toast.error('Please enter a valid auction amount.')
    if (!buyOutAmount) return toast.error('Please enter a valid auction amount.')
    if (!endTimestamp) return toast.error('Please select an end date')
    if (!selectedNFT) return toast.error('Please select an NFT')

    const contractAddress = selectedNFT?.contractAddress
    const tokenId = selectedNFT?.nft?.id

    createAuctionMutation.mutate(
      {
        auctionDetails: {
          assetContract: contractAddress as string,
          tokenId: tokenId?.toString(),
          quantity: '1',
          minimumBidAmount: value,
          buyoutBidAmount: buyOutAmount,
          endTimestamp: endTimestamp,
        },
      },
      {
        onSuccess: (data: any) => {
          setBuyOutAmount('')
          setValue('')
          setSelectedNFT(null)
        },
        onError: (error: any) => {
          setBuyOutAmount('')
          setValue('')
          setSelectedNFT(null)
        },
      },
    )
  }

  const getCtaAndOnClick = (item: any) => {
    let ctaText = ''
    let icon = false
    let handleClick = () => {}

    switch (item.type) {
      case 'NFTs':
        icon = true
        ctaText = 'List / Auction'
        handleClick = () => setSelectedNFT(item)
        break
      case 'Listed':
        ctaText = 'Cancel Listing'
        handleClick = () => handleCancelDirectListing(item?.listingId)
        break
      case "Offer's Made":
        ctaText = 'Cancel Offer'
        handleClick = () => handleCancelOffer(item?.offerId)
        break
      case 'Auction':
        ctaText = 'Cancel Auction'
        handleClick = () => handleCancelAuction(item?.auctionId)
        break
      default:
        ctaText = 'Action'
        handleClick = () => alert('Does nothing')
        break
    }

    return { ctaText, handleClick, icon }
  }

  // useEffect(() => {
  //   if (!activeAccount) {
  //     router.push('/')
  //   }
  // }, [activeAccount, router])

  useEffect(() => {
    const showToast = async () => {
      if (isTxPending) {
        await toast.loading('Transaction in progress...')
      }
    }

    showToast()
  }, [toast, isTxPending])

  if (isLoading || isError) {
    return <Loader />
  }

  return activeAccount ? (
    <div className="md:px-14 px-4 flex flex-col max-xsm:items-center gap-8 relative w-full h-full">
      <Header />
      <div className="lg:ml-52 z-50 max-md:mt-10 max-w-[90%]">
        <FilterButtons className="z-50" filter={filter} setFilter={setFilter} filters={filters} />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full grid py-10 place-content-center grid-cols-4 gap-7 gap-y-10 2xl:grid-cols-6 max-lg:grid-cols-3 max-xsm:grid-cols-1 max-md:grid-cols-2">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const { ctaText, handleClick, icon } = getCtaAndOnClick(item)
              const title = item?.nft?.metadata?.name
              const src = item?.nft?.metadata?.image
              const contractAddress = item?.contractAddress || item?.assetContract
              const tokenId = item?.nft?.id || item?.tokenId

              console.log({ item })

              let details: any = []
              if (item.type === 'Listed') {
                details = [
                  {
                    label: 'Price',
                    value: `${decimalOffChain(item?.pricePerToken)} XFI`,
                  },
                  {
                    label: 'Offers',
                    value: `${item?.offersCount}`,
                  },
                ]
              } else if (item.type === "Offer's Made") {
                details = [
                  {
                    label: 'Price Offered',
                    value: `${decimalOffChain(item?.totalPrice)} WXFI`,
                  },
                  {
                    label: 'Offers',
                    value: `${item?.offersCount}`,
                  },
                ]
              } else if (item.type === 'Auction') {
                details = [
                  {
                    label: 'Buy Out Price',
                    value: `${decimalOffChain(item?.buyoutBidAmount)} XFI`,
                  },
                  {
                    label: 'Min Price',
                    value: `${decimalOffChain(item?.minimumBidAmount)} XFI`,
                  },

                  {
                    label: 'Winning Bid',
                    value: `${decimalOffChain(item?.winningBid?.bidAmount)} XFI`,
                  },
                ]
              }

              return (
                <Card
                  key={index}
                  title={title}
                  src={src}
                  cta={ctaText}
                  onClick={handleClick}
                  icon={icon}
                  details={details}
                  disabled={isTxPending}
                  contractAddress={contractAddress}
                  tokenId={tokenId}
                />
              )
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl font-semibold text-gray-400">
                No items found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
      {selectedNFT && (
        <Dialog.Root open={!!selectedNFT} onOpenChange={(open) => !open && setSelectedNFT(null)}>
          <Dialog.Content className="max-w-[690px] w-full p-6">
            <NFTDialog
              id={'none'}
              type="create"
              nftList={selectedNFT}
              setTimestamp={setEndTimestamp}
              onClick={handleCreateListing}
              secondaryOnClick={handleCreateAuction}
              onChange={setValue}
              onBuyOutChange={setBuyOutAmount}
              buyOutValue={buyOutAmount}
              disabled={isTxPending}
              value={value}
              src={
                selectedNFT.nft?.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') ||
                '/logo.svg'
              }
              title={selectedNFT.nft?.metadata?.name || ''}
            />
          </Dialog.Content>
        </Dialog.Root>
      )}
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
  contractAddress: string
}

function Card(props: CardProps) {
  const toast = useToast()
  const { activeAccount, activeWallet } = useUserChainInfo()
  const address = activeAccount?.address
  const chain = activeWallet?.getChain()
  const { src, title, onClick, cta, tokenId, disabled, icon, details, contractAddress } = props

  const { data: isApproved } = useCheckApprovedForAllQuery({
    collectionContractAddress: contractAddress,
  })
  const approvedForAllMutation = useApprovedForAllMutation()

  const handleApproveNFT = async () => {
    if (!address) return toast.error('Please connect to a wallet.')
    if (chain?.id !== 4157) return toast.error('Please switch to CrossFi Testnet.')

    approvedForAllMutation.mutate({
      collectionContractAddress: contractAddress,
    })
  }

  useEffect(() => {
    const showToast = async () => {
      if (disabled) {
        await toast.loading('Transaction in progress...')
      }
    }

    showToast()
  }, [toast, disabled])

  return (
    <div className="max-w-[275px] w-full rounded-2xl max-h-[405px]">
      <Link href={`/nft/${contractAddress}/CFC-721/${tokenId}`}>
        <MediaRenderer
          src={src || '/logo.svg'}
          client={client}
          className="rounded-tr-2xl rounded-tl-2xl"
        />
      </Link>
      <div className="p-4 bg-primary rounded-br-2xl rounded-bl-2xl">
        <p className={cn('font-semibold', { 'pb-3': details })}>{title}</p>
        {details && (
          <div className="w-full border-t border-t-white/25 pt-3 flex items-center justify-between">
            {details.map((detail, index) => {
              const { label, value } = detail

              return (
                <div key={index} className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xm text-foreground font-semibold">{value}</p>
                </div>
              )
            })}
          </div>
        )}
        <Button
          disabled={disabled}
          onClick={isApproved ? onClick : handleApproveNFT}
          variant="secondary"
          className="h-10 mt-3 flex items-center gap-3"
        >
          {isApproved ? cta : 'Approve Spending'}
          {icon && <Icon iconType={'cart'} className="w-4 text-white" />}
        </Button>
      </div>
    </div>
  )
}

UserProfile.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>
}
