export enum Status {
  UNSET,
  CREATED,
  COMPLETED,
  CANCELLED,
}

export type NFTType = "ERC721" | "ERC1155";
export type NFTTypeV2 = "CFC-20" | "CFC-721";

export const TokenType = {
  ERC721: 0,
  ERC1155: 1,
};

export const StatusType = {
  UNSET: 0,
  CREATED: 1,
  COMPLETED: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  EXPIRED: 5,
};

export type CreateDirectListingType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency?: string;
  pricePerToken: string;
  startTimestamp?: string;
  endTimestamp?: Date;
  reserved?: boolean;
};

export type MakeOfferListingType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  totalPrice: string;
  expirationTimestamp?: string;
};

export type BuyFromDirectListingType = {
  listingId: string;
  buyFor: string;
  quantity: string;
  currency: string;
  totalPrice: string;
  nativeTokenValue: string;
};

export type AuctionBaseType = {
  assetContract: string;
  tokenId: string;
  quantity: string;
  currency: string;
  minimumBidAmount: string;
  buyoutBidAmount: string;
  timeBufferInSeconds: string;
  bidBufferBps: string;
  startTimestamp?: string;
  endTimestamp?: Date;
};

export type CreateAuctionType = AuctionBaseType;

export type GetAllAuctionType = AuctionBaseType & {
  auctionId: string;
  auctionCreator: string;
  tokenType: keyof typeof TokenType;
  status: keyof typeof StatusType;
};

interface NFTData {
  address: string;
  balance: string;
  blockNumber: number;
  contractAddress: string;
  decimals: string | null;
  timestamp: string;
  tokenIds: string[];
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
}

export interface NFTResponse {
  docs: NFTData[];
  hasNext: boolean;
  limit: number;
  page: number;
}
