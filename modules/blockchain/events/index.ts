import { MARKETPLACE_CONTRACT } from "@/utils/configs";
import { fromBlock, getContractCustom, getCurrentBlockNumber } from "../lib";
import { getContractEvents, prepareEvent } from "thirdweb";

/* -------------------------------------------------------------------------------------------------
 * EVENTS FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getNewListing() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event NewListing(address indexed listingCreator, uint256 indexed listingId, address indexed assetContract, (uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved) listing)",
  });

  const newListingEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = newListingEvent.map((event) => event.args);

  return response;
}

// listing
export async function getNewSale() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event NewSale(address indexed listingCreator, uint256 indexed listingId, address indexed assetContract, uint256 tokenId, address buyer, uint256 quantityBought, uint256 totalPricePaid)",
  });

  const newSaleEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = newSaleEvent.map((event) => event.args);

  return response;
}

export async function getNewAuction() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event NewAuction(address indexed auctionCreator, uint256 indexed auctionId, address indexed assetContract, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
  });

  const newAuctionEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = newAuctionEvent.map((event) => event.args);

  return response;
}

// auction
export async function getNewBid() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event NewBid(uint256 indexed auctionId, address indexed bidder, address indexed assetContract, uint256 bidAmount, (uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status) auction)",
  });

  const newBidEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = newBidEvent.map((event) => event.args);

  return response;
}

// listing
export async function getNewOffer() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event NewOffer(address indexed offeror, uint256 indexed offerId, address indexed assetContract, (uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status) offer)",
  });

  const newOfferEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = newOfferEvent.map((event) => event.args);

  return response;
}

// auction
export async function getRecentlySold() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const currentBlockNumber = await getCurrentBlockNumber();

  const preparedEvent = prepareEvent({
    signature:
      "event AcceptedOffer(address indexed offeror, uint256 indexed offerId, address indexed assetContract, uint256 tokenId, address seller, uint256 quantityBought, uint256 totalPricePaid)",
  });

  const recentlySoldEvent = await getContractEvents({
    contract: contract,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(currentBlockNumber),
    events: [preparedEvent],
  });

  const response = recentlySoldEvent.map((event) => event.args);

  return response;
}
