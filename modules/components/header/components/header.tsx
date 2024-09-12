import React, { useState } from 'react'
import {
  useGetGlobalListingOrAuctionQuery,
  useGetMarketplaceCollectionsQuery,
} from '@/modules/query'
import { NFTType, StatusType } from '@/utils/lib/types'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NFTCard } from './nft-card'
import { FilterButtons } from './filter'
import { NewAuction, NewListing } from '../types/types'
import { Loader } from '@/modules/app'
import { FilteredContent } from './filtered-data'
import { NFT } from 'thirdweb'
import Link from 'next/link'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'

type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

const filters: FilterType[] = ['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned']

export function Header() {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()

  const {
    data: collections,
    isLoading: loading,
    isError: error,
  } = useGetMarketplaceCollectionsQuery()

  const getFilteredData = () => {
    if (!global) return []

    const recentlyListed = global.allListing
      .filter((item: NewListing) => item.status === StatusType.CREATED)
      .reverse()
      .slice(0, 20) as NewListing[]

    const recentlySold = global.recentlySold.reverse().slice(0, 20) as (NewListing | NewAuction)[]

    const recentlyAuctioned = global.allAuction
      .filter((item: NewAuction) => item.status === StatusType.CREATED)
      .reverse()
      .slice(0, 20) as NewAuction[]

    switch (filter) {
      case 'Recently Listed':
        return recentlyListed
      case 'Recently Sold':
        return recentlySold
      case 'Recently Auctioned':
        return recentlyAuctioned
      case 'All':
      default:
        return [...recentlyListed, ...recentlyAuctioned]
    }
  }

  const filteredData = getFilteredData()

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
    centerPadding: '60px',
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  }

  // if (isLoading || isError) return <Loader />

  const renderItem = (item: NewListing | NewAuction, index: number) => {
    const isListing = 'listingId' in item
    const nft = item.nft
    const tokenId = item.tokenId
    const assetContract = item.assetContract
    const pricePerToken = isListing ? item.pricePerToken : undefined
    const currency = isListing ? item.currency : item.winningBid.currency
    const buyOutAmount = !isListing ? item.buyoutBidAmount : undefined
    const creator = isListing ? item.listingCreator : item.auctionCreator
    const soldType = 'soldType' in item ? item?.soldType : undefined

    return (
      <NFTCard
        key={index}
        nft={nft}
        pricePerToken={pricePerToken}
        currency={currency}
        buyoutBidAmount={buyOutAmount}
        tokenId={tokenId}
        contractAddress={assetContract}
        type={'CFC-721'}
        creator={creator}
        soldType={soldType}
        viewType={soldType !== undefined ? 'sold' : undefined}
      />
    )
  }

  return (
    <div>
      <div className='border border-red-500'>
        <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />

        {isLoading || isError ? (
          <Loader className="!h-[40vh]" />
        ) : (
          <FilteredContent
            filteredData={filteredData}
            sliderSettings={sliderSettings}
            renderItem={renderItem}
          />
        )}
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-semibold">Featured Collections</h2>

        {loading || error ? (
          <Loader className="!h-[40vh]" />
        ) : (
          <div className="grid grid-cols-6 gap-7 mt-3">
            {collections?.map((item: CollectionData) => (
              <>
                <CollectionCard
                  _id={item.collection._id}
                  name={item.collection.name}
                  description={item.collection.description}
                  image={item.collection.image}
                  collectionContractAddress={item.collection.collectionContractAddress}
                />
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type Collection = {
  _id: string
  collectionContractAddress?: string
  name: string
  description?: string
  nftType?: NFTType
  image?: string
}

type CollectionData = {
  collection: Collection
  nfts: NFT
  totalVolume: number
  floorPrice: string
}

function CollectionCard({ image, collectionContractAddress }: Collection) {
  const href = `/collections/${collectionContractAddress}`

  return (
    <Link
      href={href}
      className="relative cursor-pointer w-fit max-w-[320px] h-[320px] border border-red-500 rounded-[20px] group overflow-hidden"
    >
      <MediaRenderer
        client={client}
        src={image}
        className="w-full h-full rounded-2xl group-hover:scale-105 transition duration-300 ease-in-out"
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-end flex-col h-[180px] p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
        <p>{collectionContractAddress}</p>
      </div>
    </Link>
  )
}
