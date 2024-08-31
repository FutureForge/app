// components/MarketplaceEventComponent.tsx
import React, { useState } from 'react'
import { useMarketplaceEventQuery } from '@/modules/query'
import { NewAuction, NewListing, RecentlySoldAuction } from './types/types'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recent Auctioned'

const MarketplaceEventComponent: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('All')
  const { data: newListingEvent, isLoading, isError } = useMarketplaceEventQuery()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading data.</p>

  const {
    newListing = [],
    newAuction = [],
    newSaleListing = [],
    recentlySoldAuction = [],
  } = newListingEvent || {}

  // Filter data based on the selected filter
  const filteredData = (() => {
    switch (filter) {
      case 'Recently Listed':
        return newListing
      case 'Recently Sold':
        return recentlySoldAuction
      case 'Recent Auctioned':
        return newAuction
      case 'All':
      default:
        return [...newListing, ...recentlySoldAuction, ...newAuction, ...newSaleListing]
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
        {filteredData.length === 0 ? (
          <div className='flex w-full items-center justify-center h-full'>
            <p>No data available</p>
          </div>
        ) : (
          <Slider {...settings}>
            {filteredData.map((item, index) => {
              if ('listingId' in item) {
                // Handle NewListing type
                const listing = item as NewListing
                const nft = listing.nft
                const imageUrl = nft?.metadata.image
                return (
                  <div key={index}>
                    <Image
                      src={
                        imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') ||
                        '/assets/webp/1.webp'
                      }
                      alt={nft?.metadata.name || 'NFT'}
                      width={300}
                      height={300}
                    />
                    <h3>Listing ID: {listing.listingId.toString()}</h3>
                    <p>
                      <strong>Creator:</strong> {listing.listingCreator}
                    </p>
                    <p>
                      <strong>Asset Contract:</strong> {listing.assetContract}
                    </p>
                    {/* <p>
                        <strong>Token ID:</strong> {listing.listing.tokenId.toString()}
                      </p> */}
                    {/* <p>
                        <strong>Quantity:</strong> {listing.listing.quantity.toString()}
                      </p> */}
                    {/* Add more fields as needed */}
                  </div>
                )
              }

              if ('offerId' in item) {
                // Handle RecentlySoldAuction type
                const soldAuction = item as RecentlySoldAuction
                const nft = soldAuction.nft
                const imageUrl = nft?.metadata.image
                return (
                  <div className="flex" key={index}>
                    <Image
                      src={
                        imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') ||
                        '/assets/webp/1.webp'
                      }
                      alt={nft?.metadata.name || 'NFT'}
                      width={300}
                      height={300}
                    />
                    <h3>Offer ID: {soldAuction.offerId.toString()}</h3>
                    <p>
                      <strong>Offeror:</strong> {soldAuction.offeror}
                    </p>
                    <p>
                      <strong>Seller:</strong> {soldAuction.seller}
                    </p>
                    <p>
                      <strong>Token ID:</strong> {soldAuction.tokenId.toString()}
                    </p>
                    <p>
                      <strong>Quantity Bought:</strong> {soldAuction.quantityBought.toString()}
                    </p>
                    <p>
                      <strong>Total Price Paid:</strong> {soldAuction.totalPricePaid.toString()}
                    </p>
                    {/* Add more fields as needed */}
                  </div>
                )
              }

              if ('auctionId' in item) {
                // Handle NewAuction type
                const auction = item as NewAuction
                const nft = auction.nft
                const imageUrl = nft?.metadata.image
                return (
                  <div className="flex" key={index}>
                    <Image
                      src={
                        imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') ||
                        '/assets/webp/1.webp'
                      }
                      alt={nft?.metadata.name || 'NFT'}
                      width={300}
                      height={300}
                    />
                    <h3>Auction ID: {auction.auctionId.toString()}</h3>
                    <p>
                      <strong>Creator:</strong> {auction.auctionCreator}
                    </p>
                    <p>
                      <strong>Asset Contract:</strong> {auction.assetContract}
                    </p>
                    <p>
                      <strong>Token ID:</strong> {auction.auction.tokenId.toString()}
                    </p>
                    <p>
                      <strong>Minimum Bid:</strong> {auction.auction.minimumBidAmount.toString()}
                    </p>
                    <p>
                      <strong>Buyout Bid:</strong> {auction.auction.buyoutBidAmount.toString()}
                    </p>
                    {/* Add more fields as needed */}
                  </div>
                )
              }

              return null
            })}
          </Slider>
        )}
      </div>
    </div>
  )
}

export default MarketplaceEventComponent
