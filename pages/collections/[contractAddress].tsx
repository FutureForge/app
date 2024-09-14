'use Client'
import { Button, cn, Icon, Loader, TextField } from '@/modules/app'
import { FilterButtons } from '@/modules/components/header/components/filter'
import { Header } from '@/modules/components/profile'
import { useGetSingleCollectionQuery } from '@/modules/query'
import { client } from '@/utils/configs'
import { NFTTypeV2, PlatformFeeType, SingleNFTResponse } from '@/utils/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { motion } from 'framer-motion'
import { NewAuction, NewListing } from '@/modules/components/header/types/types'
import { decimalOffChain } from '@/modules/blockchain'
import { getFormatAddress } from '@/utils'
import Head from 'next/head'

type FilterType = 'Items' | 'Offers' | 'Sales' | 'Activity'
const filters: FilterType[] = ['Items', 'Offers', 'Sales', 'Activity']

type PicksType = 'All' | 'Listed' | 'Token ID' | 'Auction'
const picks: PicksType[] = ['All', 'Listed', 'Token ID', 'Auction']

type SingleCollectionType = SingleNFTResponse & {
  auction?: NewAuction
  listing?: NewListing
  owner?: string
  soldType?: 'listing' | 'auction'
}

const MarketplaceInfo = ({ collectionFee, marketplaceFee }: PlatformFeeType) => {
  return (
    <div className="mt-4 p-4 bg-special-bg rounded-lg">
      <h4 className="text-sm font-semibold mb-2">Marketplace Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <span className="text-gray-400">Collection Fee</span>
        <span>{collectionFee?.percent || 0}%</span>

        <span className="text-gray-400">Collection Fee Collector</span>
        <Link
          href={`https://test.xfiscan.com/address/${collectionFee?.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline text-blue-500 truncate"
        >
          {getFormatAddress(collectionFee?.address)}
        </Link>

        <span className="text-gray-400">Marketplace Fee</span>
        <span>{marketplaceFee?.percent || 0}%</span>

        <span className="text-gray-400">Marketplace Fee Collector</span>
        <Link
          href={`https://test.xfiscan.com/address/${marketplaceFee?.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline text-blue-500 truncate"
        >
          {getFormatAddress(marketplaceFee?.address)}
        </Link>
      </div>
    </div>
  )
}

export default function CollectionPage() {
  const router = useRouter()
  const { contractAddress } = router.query
  const [filter, setFilter] = useState<FilterType>('Items')
  const [selectedPick, setSelectedPick] = useState<PicksType>('All')
  const [searchTerm, setSearchTerm] = useState('')

  console.log({ filter })

  const {
    data: singleCollection,
    isLoading,
    isError,
  } = useGetSingleCollectionQuery({
    contractAddress: contractAddress as string,
  })

  console.log({ singleCollection })
  const marketplaceFee = singleCollection?.marketplaceFee
  const collectionFee = singleCollection?.collectionFee

  const sortedNFTs = singleCollection?.nfts.sort(
    (a: SingleCollectionType, b: SingleCollectionType) => {
      if (a.listing || a.auction) return -1
      if (b.listing || b.auction) return 1
      return 0
    },
  )

  const filteredNFTs = useMemo(() => {
    if (!sortedNFTs) return []

    let filtered = sortedNFTs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((nft: SingleCollectionType) =>
        nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    switch (selectedPick) {
      case 'Listed':
        filtered = filtered.filter((nft: SingleCollectionType) => nft.listing)
        break
      case 'Auction':
        filtered = filtered.filter((nft: SingleCollectionType) => nft.auction)
        break
      case 'Token ID':
        filtered = [...filtered].sort(
          (a: SingleCollectionType, b: SingleCollectionType) =>
            Number(a.tokenId) - Number(b.tokenId),
        )
        break
      case 'All':
      default:
        break
    }

    return filtered
  }, [sortedNFTs, selectedPick, searchTerm])

  const handlePickChange = (pick: PicksType) => {
    setSelectedPick(pick)
  }

  if (isLoading || isError || !singleCollection?.collection) return <Loader className="h-[80vh]" />

  const renderContent = () => {
    return (
      <>
        <Head>
          <title>
            Mint Mingle Marketplace - {singleCollection?.collection?.name || 'Collection Details'}
          </title>
          <meta
            name="description"
            content={`Collection: ${
              singleCollection?.collection?.name || 'Collection'
            } on Mint Mingle Marketplace`}
          />
        </Head>
        <div className="lg:ml-52 z-50 max-w-[90%] max-md:max-w-full max-md:w-full overflow-x-scroll scrollbar-none mb-6">
          <FilterButtons
            collection
            filter={filter}
            setFilter={setFilter}
            filters={filters}
            data={picks}
            onPickChange={handlePickChange}
            selectedPick={selectedPick}
          />
        </div>
        {filter === 'Items' && (
          <div className="relative w-full max-w-md mb-6">
            <TextField
              type="text"
              placeholder="Search by token name"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedPick('All')
              }}
            />
          </div>
        )}
        {filter === 'Items' && (
          <div className="w-full grid py-10 grid-cols-4 gap-6 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-xsm:grid-cols-1">
            {filteredNFTs && filteredNFTs.length > 0 ? (
              filteredNFTs.map((item: SingleCollectionType) => (
                <Card
                  key={item.blockNumber}
                  imageUrl={item.metadata.image}
                  type={'CFC-721'}
                  tokenId={item.tokenId}
                  contractAddress={item.contractAddress}
                  name={item.metadata.name}
                  auction={item.auction}
                  listing={item.listing}
                  listingType={item?.auction ? 'auction' : item?.listing ? 'listing' : ''}
                  owner={item.owner || item.ownerAddress}
                />
              ))
            ) : (
              <EmptyState message="No items found in this collection." />
            )}
          </div>
        )}
        {filter === 'Offers' && <OffersTable offers={singleCollection?.collectionOffers || []} />}
        {filter === 'Sales' && <SalesGrid sales={singleCollection?.sales || []} />}
        {filter === 'Activity' && (
          <ActivityList activities={singleCollection?.tokenTransfers || []} />
        )}
      </>
    )
  }

  return (
    <div className="md:px-14 px-4 flex flex-col max-xsm:items-center gap-8 relative w-full h-full">
      <Header
        isCollection
        floorPrice={singleCollection?.floorPrice}
        totalVolume={singleCollection?.totalVolume}
        listed={singleCollection?.percentageOfListed}
        totalSupply={singleCollection?.tokenDetails?.totalSupply}
        uniqueHolders={singleCollection?.tokenDetails?.holderCount}
        transferCount={singleCollection?.tokenDetails?.transferCount}
        collection={singleCollection?.collection}
        collectionFee={collectionFee?.percent}
      />

      {renderContent()}
    </div>
  )
}

type NFTCardProps = {
  tokenId?: string
  contractAddress?: string
  type?: NFTTypeV2
  imageUrl?: string
  name?: string
  auction?: NewAuction
  listing?: NewListing
  listingType?: string
  owner?: string
}

function Card(props: NFTCardProps) {
  const {
    tokenId,
    contractAddress,
    type = 'CFC-721',
    imageUrl,
    name,
    auction,
    listing,
    listingType,
    owner,
  } = props
  const [isHovered, setIsHovered] = useState(false)

  const getListingTag = () => {
    switch (listingType) {
      case 'listing':
        return (
          <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white rounded-full text-xs z-10">
            Listed
          </span>
        )
      case 'auction':
        return (
          <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white rounded-full text-xs z-10">
            Auction
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Link
      href={`/nft/${contractAddress}/${type}/${tokenId}`}
      className="flex-grow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative rounded-2xl flex flex-col group bg-primary overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
        {getListingTag()}
        <div className="w-full h-[250px] overflow-hidden rounded-t-2xl">
          <MediaRenderer
            client={client}
            src={imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>

        <div className="p-4 rounded-b-2xl flex flex-col justify-between bg-gray-800 h-[120px]">
          <div className="flex flex-col gap-3">
            <p className={cn('font-semibold text-lg truncate')}>{name}</p>

            <div className="flex w-full justify-between items-end">
              <span className="flex flex-col">
                {listingType === 'listing' && (
                  <>
                    <p className="text-sm text-gray-400">Listing Price</p>
                    <p className="font-semibold text-white">
                      {decimalOffChain(listing?.pricePerToken || 0)} XFI
                    </p>
                  </>
                )}
                {listingType === 'auction' && (
                  <>
                    <p className="text-sm text-gray-400">Minimum Bid</p>
                    <p className="font-semibold text-white">
                      {decimalOffChain(auction?.minimumBidAmount || 0)} XFI
                    </p>
                  </>
                )}
                {!listingType && <div className="h-[38px]" />}
              </span>

              <span className="flex flex-col items-end">
                <p className="text-sm text-gray-400">Owner</p>
                <p className="text-white">{getFormatAddress(owner!)}</p>
              </span>
            </div>
          </div>
        </div>
        {isHovered && (
          <motion.div
            initial={{ y: 60 }}
            animate={{ y: isHovered ? 0 : 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute bottom-2 left-4 right-4"
          >
            <Button
              variant="secondary"
              className="w-full h-[41px] flex gap-3 items-center justify-center"
            >
              View Details <Icon iconType={'arrow-right'} className="w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </Link>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20">
      <Icon iconType="empty-box" className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-xl font-semibold text-gray-500">{message}</p>
    </div>
  )
}

function OffersTable({ offers }: { offers: any[] }) {
  if (offers.length === 0) {
    return <EmptyState message="No offers available for this collection." />
  }

  // Group offers by NFT
  const groupedOffers = offers.reduce((acc, offer) => {
    const key = `${offer.nft.tokenId}-${offer.nft.metadata.name}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(offer)
    return acc
  }, {})

  const nftOffers = Object.entries(groupedOffers).map(([key, nftOffers]) => {
    const [tokenId, name] = key.split('-')
    // @ts-ignore
    const prices = nftOffers.map((offer: any) => Number(offer.totalPrice))
    return {
      tokenId,
      name,
      // @ts-ignore
      offersCount: nftOffers.length,
      minOffer: Math.min(...prices),
      maxOffer: Math.max(...prices),
    }
  })

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Token ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NFT Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Offers Count
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Offer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Offer
            </th>
          </tr>
        </thead>
        <tbody className="bg-white text-red-600 divide-y divide-gray-200">
          {nftOffers.map((nftOffer) => (
            <tr key={nftOffer.tokenId}>
              <td className="px-6 py-4 whitespace-nowrap">{nftOffer.tokenId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{nftOffer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{nftOffer.offersCount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {decimalOffChain(nftOffer.minOffer.toString() || 0)} XFI
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {decimalOffChain(nftOffer.maxOffer.toString() || 0)} XFI
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SalesGrid({ sales }: { sales: any[] }) {
  console.log({ sales })
  if (sales.length === 0) {
    return <EmptyState message="No sales recorded for this collection." />
  }

  return (
    <div className="w-full grid py-10 grid-cols-4 gap-6 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 max-xsm:grid-cols-1">
      {sales.map((sale) => (
        <div key={sale.tokenId} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4">
            <MediaRenderer
              client={client}
              src={sale.nft.metadata.image}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold mb-2">{sale.nftName}</h3>
            <p className="text-gray-600 mb-2">
              Sold for: {decimalOffChain(sale.pricePerToken || sale?.winningBid?.bidAmount)} XFI
            </p>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                sale.soldType === 'listing'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {sale.soldType === 'listing' ? 'Direct Sale' : 'Auction Sale'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityList({ activities }: { activities: any[] }) {
  if (activities.length === 0) {
    return <EmptyState message="No recent activity for this collection." />
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <div className="flex-shrink-0">
            <MediaRenderer
              client={client}
              src={activity.nft.metadata.image}
              className="w-16 h-16 object-cover rounded"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{activity.nftName}</h3>
            <p className="text-gray-600">
              Transferred from {getFormatAddress(activity.addressFrom)} to{' '}
              {getFormatAddress(activity.addressTo)}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(activity.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
