// components/MarketplaceEventComponent.tsx
import React, { useState } from 'react'
import { useGetGlobalListingOrAuctionQuery, useMarketplaceEventQuery } from '@/modules/query'
import { NewAuction, NewListing, RecentlySoldAuction } from './types/types'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { StatusType } from '@/utils/lib/types'
type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

const Header: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()
  console.log({ global })

  const recentlyListed = global?.allListing
    .filter((item) => item.status === StatusType.CREATED)
    .reverse()
    .slice(0, 20)
  const recentlySold = global?.allListing
    .filter((item) => item.status === StatusType.COMPLETED)
    .reverse()
    .slice(0, 20)
  const recentlyAuctioned = global?.allAuction
    .filter((item) => item.status === StatusType.CREATED)
    .reverse()
    .slice(0, 20)

  console.log({ recentlyListed })
  console.log({ recentlySold })
  console.log({ recentlyAuctioned })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading data.</p>

  const filteredData = (() => {
    switch (filter) {
      case 'Recently Listed':
        return recentlyListed
      case 'Recently Sold':
        return recentlySold
      case 'Recently Auctioned':
        return recentlyAuctioned
      case 'All':
      default:
        return [...(recentlyListed || []), ...(recentlySold || []), ...(recentlyAuctioned || [])]
    }
  })()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
  }
  return (
    <div className="h-screen">
      <div className="flex items-center gap-3">
        {['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned'].map((f) => (
          <button
            key={f}
            className={`px-4 py-1 m-2 rounded-xl hover:text-foreground ${
              filter === f ? 'bg-sec-bg text-foreground' : 'text-muted-foreground'
            } transition ease-in-out duration-200`}
            onClick={() => setFilter(f as any)}
          >
            {f}
          </button>
        ))}
      </div>

      <div>
        {filteredData?.length === 0 ? (
          <div className="flex w-full items-center justify-center h-full">
            <p>No data available</p>
          </div>
        ) : (
          <div className="flex mt-8 items-center gap-8">
            {filteredData?.map((item, index) => {
              if ('listingId' in item) {
                const listing = item
                return (
                  <div key={index} className="relative w-[300px] h-[320px] ">
                    <Image
                      src={'/assets/webp/1.webp'}
                      alt={'NFT'}
                      layout="fill"
                      className="absolute inset-0"
                    />
                    <div className="absolute -bottom-0 left-0 w-full flex justify-end flex-col h-[160px] p-4 bg-gradient-to-t from-black/70 via-black/60 to-transparent">
                      <h3 className="text-red-600">Listing ID: {listing.listingId.toString()}</h3>
                    </div>
                  </div>
                )
              }

              if ('auctionId' in item) {
                const auction = item
                return (
                  <div key={index}>
                    <Image src={'/assets/webp/1.webp'} alt={'NFT'} width={300} height={300} />
                  </div>
                )
              }

              return null
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
