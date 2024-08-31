// types.ts
export type NFT ={
  id: string
  metadata: {
    animation_url: string
    background_color: string
    customAnimationUrl: string
    customImage: string
    description: string
    external_url: string
    image: string
    name: string
    supply: number
  }
  owner: string
  tokenURI: string
  type: string
}

export type NewListing ={
  nft: NFT | undefined
  listingCreator: string
  listingId: bigint
  assetContract: string
  listing: {
    tokenId: bigint
    quantity: bigint
    assetContract: string
    currency: string
    tokenType: number
    reserved: boolean
  }
}

export type NewAuction ={
  nft: NFT | undefined
  auctionCreator: string
  auctionId: bigint
  assetContract: string
  auction: {
    auctionId: bigint
    tokenId: bigint
    quantity: bigint
    minimumBidAmount: bigint
    buyoutBidAmount: bigint
    status: number
  }
}

export type RecentlySoldAuction ={
  nft: NFT | undefined
  offeror: string
  offerId: bigint
  assetContract: string
  tokenId: bigint
  seller: string
  quantityBought: bigint
  totalPricePaid: bigint
}

export type MarketplaceEventData ={
  newListing: NewListing[]
  newAuction: NewAuction[]
  newSaleListing: any[] // Define this type as needed
  recentlySoldAuction: RecentlySoldAuction[]
}
