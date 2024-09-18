'use Client'
import React, { useState } from 'react'
import {
  useGetGlobalListingOrAuctionQuery,
  useGetMarketplaceCollectionsQuery,
} from '@/modules/query'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NFTCard } from './nft-card'
import { FilterButtons } from './filter'
import { NewAuction, NewListing } from '../types/types'
import { Icon, Loader } from '@/modules/app'
import Slider from 'react-slick'
import { useWindowSize } from '@uidotdev/usehooks'
import { CollectionCard, CollectionData } from './collection-card'
import { ChevronRight } from 'lucide-react'

// 0xcab0b7addb93d41e0dfec1dc4c8de564aa0440cf
// 0x55babEE194af5c59a5f17f9DeA47BE4a37DFB36d // egg collection

type FilterType =
  | 'All'
  | 'Collections'
  | 'Recently Listed'
  | 'Recently Auctioned'
  | 'Recently Sold Listing'
  | 'Recently Sold Auction'

const filters: FilterType[] = [
  'All',
  'Collections',
  'Recently Listed',
  'Recently Auctioned',
  'Recently Sold Listing',
  'Recently Sold Auction',
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

  const renderNFTItems = (items: any) => {
    return items.map((item: any, index: number) => {
      const nft = item?.nft
      const tokenId = item?.tokenId
      const assetContract = item?.assetContract
      const pricePerToken = item?.pricePerToken || item?.totalPrice
      const buyOutAmount = item?.buyoutBidAmount
      const creator = item?.listingCreator || item?.auctionCreator
      const soldType = 'soldType' in item ? item?.soldType : undefined

      return (
        <NFTCard
          key={index}
          nft={nft}
          pricePerToken={pricePerToken}
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
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerPadding: '60px',
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
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
      filter === 'All' &&
      ((isLaptop && items.length > 4) || (isMobile && items.length > 1)) &&
      items.length >= sliderSettings.slidesToShow

    const sectionSliderSettings = {
      ...sliderSettings,
      infinite: items.length > 4,
      slidesToShow: Math.min(4, items.length),
    }

    return (
      <div className="w-full px-4">
        {title && <h2 className="text-2xl font-semibold mb-8 px-4">{title}</h2>}
        {displayInSlider ? (
          <div>
            <Slider {...sectionSliderSettings}>{renderNFTItems(items)}</Slider>
          </div>
        ) : (
          <div className="flex gap-6 lg:grid grid-cols-4 flex-wrap items-center w-full pb-4">
            {renderNFTItems(items)}
          </div>
        )}
      </div>
    )
  }
  const renderCollectionSection = (items: CollectionData[]) => {
    // Determine when to display the slider based on screen size and number of items
    const displayInSlider =
      filter === 'All' && ((isLaptop && items.length > 4) || (isMobile && items.length > 1))

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-8 px-4">Featured Collections</h2>

        {displayInSlider && (
          <Slider {...sliderSettings}>
            {items.map((item) => (
              <CollectionCard
                key={item.collection?._id}
                collection={item.collection}
                floorPrice={item.floorPrice}
                totalVolume={item.totalVolume}
              />
            ))}
          </Slider>
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-20">
      {/* Filter Buttons */}
      <div className="max-md:w-[90%]">
        <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />
      </div>
      {isLoading || isError || collectionsLoading || collectionsError ? (
        <Loader className="!h-[40vh]" />
      ) : (
        <>
          {filter === 'All' && (
            <>
              {/* Featured Collections */}
              {renderCollectionSection(collections || [])}

              {/* Recently Listed */}
              {renderSection({ title: 'Recently Listed', items: global?.allListing || [] })}

              {/* Recently Auctioned */}
              {renderSection({ title: 'Recently Auctioned', items: global?.allAuction || [] })}

              {/* Recently Sold Listing */}
              {renderSection({
                title: 'Recently Sold Listing',
                items: global?.recentlySoldListing || [],
              })}

              {/* Recently Sold Auction */}
              {renderSection({
                title: 'Recently Sold Auction',
                items: global?.recentlySoldAuction || [],
              })}
            </>
          )}

          {filter === 'Recently Listed' && renderSection({ items: global?.allListing || [] })}
          {filter === 'Recently Auctioned' && renderSection({ items: global?.allAuction || [] })}
          {filter === 'Recently Sold Listing' &&
            renderSection({ items: global?.recentlySoldListing || [] })}
          {filter === 'Recently Sold Auction' &&
            renderSection({ items: global?.recentlySoldAuction || [] })}
          {filter === 'Collections' && (
            <div className="flex gap-6 pb-4 flex-wrap">
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

const CustomArrow = ({ className, style, onClick, direction }: any) => {
  return (
    <div
      className={`${className} custom-arrow custom-arrow-${direction}`}
      style={{
        ...style,
        display: 'block',
        borderRadius: '50%',
        padding: '10px',
        zIndex: 1,
        ...(direction === 'prev' ? { left: '-55px' } : { right: '-25px' }),
      }}
      onClick={onClick}
    >
      {direction === 'next' ? (
        <ChevronRight size={40} color="#999999" />
      ) : (
        <ChevronRight size={40} color="#999999" className="rotate-180" />
      )}
    </div>
  )
}
