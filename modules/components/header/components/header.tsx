'use Client'
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

type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned' | 'Collections'

const filters: FilterType[] = [
  'All',
  'Recently Listed',
  'Recently Sold',
  'Recently Auctioned',
  'Collections',
]

export function Header() {
  const { width } = useWindowSize() // use this hook to get the current width
  const isLaptop = width && width >= 1024 // define laptop breakpoint
  const isMobile = width && width < 640 // define mobile breakpoint

  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()
  const {
    data: collections,
    isLoading: collectionsLoading,
    isError: collectionsError,
  } = useGetMarketplaceCollectionsQuery()

  const renderNFTItems = (items: (NewListing | NewAuction)[]) => {
    return items.map((item, index) => {
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
    })
  }
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4.2,
    slidesToScroll: 1,
    arrows: true,
    centerPadding: '60px',
    autoplay: false,
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
          slidesToShow: 1.3,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  }

  const renderSection = ({
    title,
    items,
  }: {
    title?: string
    items: (NewListing | NewAuction)[]
  }) => {
    const displayInSlider =
      filter === 'All' && ((isLaptop && items.length > 4) || (isMobile && items.length > 1))

    return (
      <div className='w-full px-4'>
        {title && <h2 className="text-2xl font-semibold mb-8 px-4">{title}</h2>}
        {displayInSlider ? (
          <div className="">
            <Slider {...sliderSettings}>{renderNFTItems(items)}</Slider>
          </div>
        ) : (
          <div className="flex gap-6 flex-wrap items-center justify-center w-full pb-4">
            {/* grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 */}
            {renderNFTItems(items)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-20">
      {/* Filter Buttons */}
      <div className='max-md:w-[90%]'>
        <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />
      </div>

      {isLoading || isError || collectionsLoading || collectionsError ? (
        <Loader className="!h-[80vh]" />
      ) : (
        <>
          {filter === 'All' && (
            <>
              {/* Featured Collections */}
              <div>
                <h2 className="text-2xl font-semibold mb-8 px-4">Featured Collections</h2>

                {/* <div className="flex overflow-x-auto gap-6 pb-4 flex-wrap"> */}
                <div className="min-h-[300px] w-full relative">
                  <Slider {...sliderSettings}>
                    {collections?.map((item: CollectionData) => (
                      <CollectionCard
                        key={item.collection?._id}
                        collection={item.collection}
                        floorPrice={item.floorPrice}
                        totalVolume={item.totalVolume}
                      />
                    ))}
                  </Slider>
                </div>
                {/* </div> */}
              </div>

              {/* Recently Listed */}
              {renderSection({ title: 'Recently Listed', items: global?.allListing || [] })}

              {/* Recently Sold */}
              {renderSection({ title: 'Recently Sold', items: global?.recentlySold || [] })}

              {/* Recently Auctioned */}
              {renderSection({ title: 'Recently Auctioned', items: global?.allAuction || [] })}
            </>
          )}

          {filter === 'Recently Listed' && renderSection({ items: global?.allListing || [] })}
          {filter === 'Recently Sold' && renderSection({ items: global?.recentlySold || [] })}
          {filter === 'Recently Auctioned' && renderSection({ items: global?.allAuction || [] })}
          {filter === 'Collections' && (
            <div className="flex gap-6 pb-4 flex-wrap gap-y-">
              {collections?.map((item: CollectionData) => (
                <CollectionCard
                  key={item.collection?._id}
                  collection={item.collection}
                  floorPrice={item.floorPrice}
                  totalVolume={item.totalVolume}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}


