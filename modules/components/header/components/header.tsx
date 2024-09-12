"use Client"
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
import { ClientOnly, Icon, Loader } from '@/modules/app'
import { FilteredContent } from './filtered-data'
import { NFT } from 'thirdweb'
import Link from 'next/link'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'
import { useMediaQuery } from '@uidotdev/usehooks'
import Slider from 'react-slick'
import { useWindowSize } from '@uidotdev/usehooks'
import { CollectionCard, CollectionData } from './collection-card'

type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

const filters: FilterType[] = ['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned']

export function Header() {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()
    const { width } = useWindowSize()
    const isMobile = width && width <= 440
    const isDesktop = width && width >= 1024


  const {
    data: collections,
    isLoading: loading,
    isError: error,
  } = useGetMarketplaceCollectionsQuery()

  // Determine whether to use slider based on number of collections
  const useSlider = (collections?.length ?? 0) > (isMobile ? 1 : isDesktop ? 4 : 1)
  const getFilteredData = () => {
    if (!global) return []

    const recentlyListed = global.allListing as NewListing[]

    const recentlySold = global.recentlySold as (NewListing | NewAuction)[]

    const recentlyAuctioned = global.allAuction as NewAuction[]

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
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
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
  const filteredData = getFilteredData()

  const renderItem = (item: NewListing | NewAuction, index: number) => {
    const isListing = 'listingId' in item
    const nft = item?.nft
    const tokenId = item?.tokenId
    const assetContract = item?.assetContract
    const pricePerToken = isListing ? item?.pricePerToken : undefined
    const currency = isListing ? item?.currency : item?.winningBid?.currency
    const buyOutAmount = !isListing ? item?.buyoutBidAmount : undefined
    const creator = isListing ? item?.listingCreator : item?.auctionCreator
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
    <div className="flex flex-col gap-20">
      <div>
        <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />

        <div className="mt-8 w-full">
          {isLoading || isError ? (
            <Loader className="!h-[40vh]" />
          ) : (
            <FilteredContent
              sliderSettings={sliderSettings}
              filteredData={filteredData}
              renderItem={renderItem}
            />
          )}
        </div>
      </div>

      <div className="mt-14">
        <div className='px-4'>
          <h2 className="text-2xl font-semibold mb-8">Featured Collections</h2>
        </div>

        {loading || error ? (
          <Loader className="!h-[40vh]" />
        ) : (
          <ClientOnly>
            {useSlider ? (
              <Slider {...sliderSettings}>
                {collections?.map((item: CollectionData) => (
                  <CollectionCard
                    key={item.collection?._id}
                    collection={item.collection}
                    floorPrice={item.floorPrice}
                  />
                ))}
              </Slider>
            ) : (
              <div className="flex flex-wrap gap-7 mt-3">
                {collections?.map((item: CollectionData) => (
                  <CollectionCard
                    key={item.collection?._id}
                    collection={item.collection}
                    floorPrice={item.floorPrice}
                  />
                ))}
              </div>
            )}
          </ClientOnly>
        )}
      </div>
    </div>
  )
}


