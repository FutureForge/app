import { SingleNFTResponse } from '@/utils/lib/types'
import { NFT } from 'thirdweb'

// export type NFT = {
//   id: string
//   metadata: {
//     animation_url: string
//     background_color: string
//     customAnimationUrl: string
//     customImage: string
//     description: string
//     external_url: string
//     image: string
//     name: string
//     supply: number
//   }
//   owner: string
//   tokenURI: string
//   type: string
// }

export type NewListing = {
  nft: SingleNFTResponse
  tokenId: string
  quantity: bigint
  assetContract: string
  currency: string
  tokenType: number
  status: number
  listingId: bigint
  pricePerToken: bigint
  startTimestamp: bigint
  endTimestamp: bigint
  listingCreator: string
  reserved: boolean
  totalPrice?: string
  id: 'listing' | 'auction'
}

export type NewAuction = {
  winningBid: {
    bidder: string
    currency: string
    bidAmount: bigint
  }
  id: 'listing' | 'auction'
  nft: SingleNFTResponse
  auctionId: bigint
  tokenId: string
  quantity: bigint
  minimumBidAmount: bigint
  buyoutBidAmount: bigint
  status: number
  assetContract: string
  auctionCreator: string
  // add any other fields you have
}

export type RecentlySoldAuction = {
  nft: SingleNFTResponse
  offeror: string
  offerId: bigint
  assetContract: string
  tokenId: bigint
  seller: string
  quantityBought: bigint
  totalPricePaid: bigint
}

export type MarketplaceEventData = {
  newListing: NewListing[]
  newAuction: NewAuction[]
  newSaleListing: any[] // Define this type as needed
  recentlySoldAuction: RecentlySoldAuction[]
}
