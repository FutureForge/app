import React, { useState } from 'react'
import { useGetGlobalListingOrAuctionQuery } from '@/modules/query'

import { StatusType } from '@/utils/lib/types'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NFTCard } from './nft-card'
import { FilterButtons } from './filter'
import { NewAuction, NewListing } from '../types/types'

type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

export function Header() {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()

  const getFilteredData = () => {
    if (!global) return []

    const recentlyListed = global.allListing
      .filter((item) => item.status === StatusType.CREATED)
      .reverse()
      .slice(0, 20) as NewListing[]

    const recentlySold = global.allListing
      .filter((item) => item.status === StatusType.COMPLETED)
      .reverse()
      .slice(0, 20) as NewListing[]

    const recentlyAuctioned = global.allAuction
      .filter((item) => item.status === StatusType.CREATED)
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
        return [...recentlyListed, ...recentlySold, ...recentlyAuctioned]
    }
  }

  const filteredData = getFilteredData()

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading data.</p>

  const renderItem = (item: NewListing | NewAuction, index: number) => {
    const isListing = 'listingId' in item
    const nft = item.nft
    const pricePerToken = isListing ? item.pricePerToken : undefined
    const currency = isListing ? item.currency : item.winningBid.currency
    const buyOutAmount = !isListing ? item.buyoutBidAmount : undefined

    return (
      <NFTCard
        key={index}
        nft={nft}
        pricePerToken={pricePerToken}
        currency={currency}
        buyoutBidAmount={buyOutAmount}
      />
    )
  }

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />

      <div className="">
        {filteredData.length === 0 ? (
          <div className="flex w-full items-center justify-center h-[320px]">
            <p>No data available</p>
          </div>
        ) : filteredData.length > 4 ? (
          <Slider {...sliderSettings}>{filteredData.map(renderItem)}</Slider>
        ) : (
          <div className="flex mt-8 items-center gap-8">{filteredData.map(renderItem)}</div>
        )}
      </div>
    </div>
  )
}
