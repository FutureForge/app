export enum Status {
  UNSET,
  CREATED,
  COMPLETED,
  CANCELLED,
}

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
  endTimestamp?: string;
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
