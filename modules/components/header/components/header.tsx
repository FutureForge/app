import React, { useState } from 'react'
import { useGetGlobalListingOrAuctionQuery } from '@/modules/query'

import { NFTTypeV2, StatusType } from '@/utils/lib/types'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NFTCard } from './nft-card'
import { FilterButtons } from './filter'
import { NewAuction, NewListing } from '../types/types'
import Image from 'next/image'
import { Loader } from '@/modules/app'
import { useMediaQuery } from '@uidotdev/usehooks'

type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

const filters: FilterType[] = ['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned']

export function Header() {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()
  console.log({ global })

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

  if (isLoading || isError) return <Loader />

  const renderItem = (item: NewListing | NewAuction, index: number) => {
    const isListing = 'listingId' in item
    const nft = item.nft
    const tokenId = item.tokenId
    const assetContract = item.assetContract
    const type = nft?.type as NFTTypeV2
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
        type={type}
        creator={creator}
        soldType={soldType}
        viewType={soldType !== undefined ? 'sold' : undefined}
      />
    )
  }

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />

      <div className="px-4 max-xsm:mt-5">
        {filteredData.length === 0 ? (
          <div className="flex w-full items-center justify-center h-[320px]">
            <p>No data available</p>
          </div>
        ) : filteredData.length > 4 ? (
          <Slider {...sliderSettings}>{filteredData.map(renderItem)}</Slider>
        ) : (
          <div className="flex mt-8 items-center gap-8 flex-wrap">
            {filteredData.map((item, index) => (
              <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
