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
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: global, isLoading, isError } = useGetGlobalListingOrAuctionQuery()
  const {
    data: collections,
    isLoading: collectionsLoading,
    isError: collectionsError,
  } = useGetMarketplaceCollectionsQuery()

  if (isLoading || isError || collectionsLoading || collectionsError)
    return <Loader className="!h-[80vh]" />

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

  const renderSection = ({
    title,
    items,
  }: {
    title?: string
    items: (NewListing | NewAuction)[]
  }) => (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-8 px-4">{title}</h2>}
      <div className="flex overflow-x-auto gap-6 pb-4">{renderNFTItems(items)}</div>
    </div>
  )

  return (
    <div className="flex flex-col gap-20">
      {/* Filter Buttons */}
      <div className="px-4">
        <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />
      </div>

      {filter === 'All' && (
        <>
          {/* Featured Collections */}
          <div>
            <h2 className="text-2xl font-semibold mb-8 px-4">Featured Collections</h2>
            {collectionsLoading || collectionsError ? (
              <Loader className="!h-[40vh]" />
            ) : (
              <div className="flex overflow-x-auto gap-6 pb-4">
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
        <div>
          {collectionsLoading || collectionsError ? (
            <Loader className="!h-[40vh]" />
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4">
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
        </div>
      )}
    </div>
  )
}


