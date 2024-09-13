import { GetBalanceResult } from "thirdweb/extensions/erc20"

export enum Status {
  UNSET,
  CREATED,
  COMPLETED,
  CANCELLED,
}

export type NFTType = 'ERC721' | 'ERC1155'
export type NFTTypeV2 = 'CFC-20' | 'CFC-721'

export const TokenType = {
  ERC721: 0,
  ERC1155: 1,
}

export const StatusType = {
  UNSET: 0,
  CREATED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  EXPIRED: 5,
}

export type CreateDirectListingType = {
  assetContract: string
  tokenId: string
  quantity: string
  currency?: string
  pricePerToken: string
  startTimestamp?: string
  endTimestamp?: Date
  reserved?: boolean
}

export type MakeOfferListingType = {
  assetContract: string
  tokenId: string
  quantity: string
  currency: string
  totalPrice: string
  expirationTimestamp?: Date
}

export type BuyFromDirectListingType = {
  listingId: string
  buyFor: string
  quantity: string
  currency: string
  totalPrice: string
  nativeTokenValue: string
}

export type AuctionBaseType = {
  assetContract: string
  tokenId: string
  quantity: string
  currency: string
  minimumBidAmount: string
  buyoutBidAmount: string
  timeBufferInSeconds: string
  bidBufferBps: string
  startTimestamp?: string
  endTimestamp?: Date
}

export type CreateAuctionType = AuctionBaseType

export type GetAllAuctionType = AuctionBaseType & {
  auctionId: string
  auctionCreator: string
  tokenType: keyof typeof TokenType
  status: keyof typeof StatusType
}

interface NFTData {
  address: string
  balance: string
  blockNumber: number
  contractAddress: string
  decimals: string | null
  timestamp: string
  tokenIds: string[]
  tokenName: string
  tokenSymbol: string
  tokenType: string
}

export interface UserNFTResponse {
  docs: NFTData[]
  hasNext: boolean
  limit: number
  page: number
}

export type NFTActivity = {
  addressFrom: string
  addressTo: string
  blockNumber: number
  contractAddress: string
  decimals: number | null
  timestamp: string
  tokenId: string
  tokenName: string
  tokenSymbol: string
  tokenType: string
  txHash: string
  uniqueHash: string
}

export type NFTActivityResponse = {
  docs: NFTActivity[]
  hasNext: boolean
  limit: number
  page: number
}

export type NFTMetadata = {
  image: string
  external_url: string
  description: string
  name: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  background_color: string
  animation_url: string
}

export type SingleNFTResponse = {
  contractAddress: string
  tokenId: string
  blockNumber: number
  creatorAddress: string
  ownerAddress: string
  timestamp: string
  tokenName: string
  tokenSymbol: string
  tokenType: string
  tokenURI: string
  transferCount: number
  metadata: NFTMetadata
}

export type CollectionNFTResponse = {
  docs: SingleNFTResponse[]
  hasNext: boolean
  limit: number
  page: number
}

export type OfferType = {
  assetContract: string
  currency: string
  expirationTimestamp: string
  offerId: string
  offeror: string
  quantity: string
  status: number
  tokenId: string
  tokenType: number
  totalPrice: string
}