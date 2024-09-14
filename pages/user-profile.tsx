import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ConnectButton, MediaRenderer } from 'thirdweb/react'
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
import { chainInfo, client } from '@/utils/configs'
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
import Link from 'next/link'
import { SingleNFTResponse } from '@/utils/lib/types'
import { createWallet } from 'thirdweb/wallets'
import { getFormatAddress } from '@/utils'

type FilterType = 'NFTs' | 'Listed' | 'Auction' | "Offer's Made"

const filters: FilterType[] = ['NFTs', 'Listed', 'Auction', "Offer's Made"]

type NFTSelectedItem = {
  address: string
  balance: string
  blockNumber: number
  contractAddress: string
  decimals: number | null
  nft: SingleNFTResponse
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

  const {
    data: userNFTS,
    isLoading: userNFTLoading,
    isError: userNFTError,
    error,
  } = useUserNFTsQuery()
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
    const tokenId = selectedNFT?.nft?.tokenId

    if (!tokenId) toast.error('cant find out the token id')

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
          router.push(`/nft/${contractAddress}/CFC-721/${tokenId}`)
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
    const tokenId = selectedNFT?.nft?.tokenId

    if (!tokenId) toast.error('cant find out the token id')

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
          router.push(`/nft/${contractAddress}/CFC-721/${tokenId}`)
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

  const isUserActive = !!activeAccount

  if (isLoading || isError) {
    return <Loader className="!h-[80vh]" />
  }

  return (
    <>
      <Head>
        <title>Mint Mingle - {address ? getFormatAddress(address!) : 'No User'}</title>
      </Head>
      <div className="md:px-14 px-4 flex flex-col max-xsm:items-center gap-8 relative w-full h-full">
        <Header />
        <div className="lg:ml-52 z-50 max-md:mt-10 max-w-[90%]">
          <FilterButtons
            className="z-50"
            filter={filter}
            setFilter={setFilter}
            filters={filters}
            disabled={!isUserActive}
          />
        </div>
        {isUserActive ? (
          <div className="flex items-center justify-center w-full">
            <div className="w-full grid py-10 grid-cols-4 gap-x-7 gap-y-24 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 max-xsm:grid-cols-1">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const { ctaText, handleClick, icon } = getCtaAndOnClick(item)
                  const title = item?.nft?.metadata?.name
                  const src = item?.nft?.metadata?.image || item?.nft?.tokenURI
                  const contractAddress = item?.contractAddress || item?.assetContract
                  const tokenId = item?.nft?.tokenId || item?.tokenId || item?.nft?.id

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
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl font-semibold text-gray-400 mb-4">No active user</p>
            <p className="text-lg text-gray-300 mb-8">
              Please connect your wallet to view your profile
            </p>
            <ConnectButton
              client={client}
              chain={chainInfo}
              wallets={[createWallet('io.metamask')]}
              connectButton={{
                label: 'Connect Wallet',
                className:
                  '!font-inter !rounded-xl lg:!w-36 !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!bg-primary/65 hover:!text-foreground !duration-300 !ease-in-out !transition !bg-primary !text-muted-foreground !h-10 !mt-4',
              }}
            />
          </div>
        )}
        {selectedNFT && (
          <Dialog.Root
            open={!!selectedNFT}
            onOpenChange={(open: boolean) => !open && setSelectedNFT(null)}
          >
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
                src={`${
                  selectedNFT.nft?.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') ||
                  '/logo.svg'
                }`}
                title={selectedNFT.nft?.metadata?.name || ''}
              />
            </Dialog.Content>
          </Dialog.Root>
        )}
      </div>
    </>
  )
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

  return (
    <div className="max-w-[275px] w-full rounded-2xl flex flex-col">
      <Link href={`/nft/${contractAddress}/CFC-721/${tokenId}`} className="flex-grow">
        <MediaRenderer
          src={`${src || '/logo.svg'}`}
          client={client}
          className="rounded-tr-2xl rounded-tl-2xl h-[275px] w-full object-cover"
        />
      </Link>
      <div className="p-4 bg-primary rounded-br-2xl rounded-bl-2xl flex flex-col justify-between">
        <div>
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
        </div>
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
