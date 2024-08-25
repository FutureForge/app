import {
  convertToBlockchainTimestamp,
  getCurrentBlockchainTimestamp,
} from "@/utils";
import { MARKETPLACE_CONTRACT } from "@/utils/configs";
import {
  BuyFromDirectListingType,
  CreateAuctionType,
  CreateDirectListingType,
  MakeOfferListingType,
} from "@/utils/lib/types";
import {
  getContractEvents,
  prepareContractCall,
  prepareEvent,
  readContract,
  toWei,
} from "thirdweb";
import { getContractCustom, getCurrentBlockNumber } from "./lib";

const fromBlock = 6543730;
const nativeCurrency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

/* -------------------------------------------------------------------------------------------------
 * READ FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getTotalListings() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalListings = await readContract({
    contract,
    method: "function totalListings() view returns (uint256)",
    params: [],
  });

  return Number(totalListings) - 1;
}

export async function getTotalOffers() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalOffers = await readContract({
    contract,
    method: "function totalOffers() view returns (uint256)",
    params: [],
  });

  return Number(totalOffers) - 1;
}

export async function getTotalAuctions() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalAuctions = await readContract({
    contract,
    method: "function totalAuctions() view returns (uint256)",
    params: [],
  });

  return Number(totalAuctions) - 1;
}

export async function getAllListing() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalListings = await getTotalListings();

  const allListings = await readContract({
    contract,
    method:
      "function getAllListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _allListings)",
    params: [BigInt(0), BigInt(totalListings)],
  });

  return allListings;
}

export async function getAllOffers() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalOffers = await getTotalOffers();

  const allOffers = await readContract({
    contract,
    method:
      "function getAllOffers(uint256 _startId, uint256 _endId) view returns ((uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allOffers)",
    params: [BigInt(0), BigInt(totalOffers)],
  });

  return allOffers;
}

export async function getAllAuctions() {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  const totalAuctions = await getTotalAuctions();

  const allAuctions = await readContract({
    contract,
    method:
      "function getAllAuctions(uint256 _startId, uint256 _endId) view returns ((uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allAuctions)",
    params: [BigInt(0), BigInt(totalAuctions)],
  });

  return allAuctions;
}

/* -------------------------------------------------------------------------------------------------
 * EVENTS FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getCheckApprovedForAll({
  walletAddress,
  collectionContractAddress,
}: {
  walletAddress: string;
  collectionContractAddress: string;
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  });

  const approved = await readContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: [walletAddress, MARKETPLACE_CONTRACT],
  });

  return approved;
}

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

/* -------------------------------------------------------------------------------------------------
 * WRITE FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getSetApprovalForAll({
  collectionContractAddress,
  approved = true,
}: {
  collectionContractAddress: string;
  approved?: boolean;
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function setApprovalForAll(address operator, bool approved)",
    params: [MARKETPLACE_CONTRACT, approved],
  });

  return transaction;
}

export async function getCreateDirectListing({
  params: _params,
}: {
  params: CreateDirectListingType;
}) {
  const startTimestamp = getCurrentBlockchainTimestamp();
  const endTimestamp = convertToBlockchainTimestamp(_params.endTimestamp);

  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    pricePerToken: toWei(_params.pricePerToken),
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    reserved: _params.reserved || false,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)",
    params: [formattedParams],
  });

  return transaction;
}

export async function getUpdateDirectListing({
  listingId,
  params: _params,
}: {
  listingId: string;
  params: CreateDirectListingType;
}) {
  const startTimestamp = getCurrentBlockchainTimestamp();
  const endTimestamp = convertToBlockchainTimestamp(_params.endTimestamp);

  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    pricePerToken: toWei(_params.pricePerToken),
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    reserved: _params.reserved || false,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function updateListing(uint256 _listingId, (address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params)",
    params: [BigInt(listingId), formattedParams],
  });

  return transaction;
}

export async function getCancelDirectListing({
  listingId,
}: {
  listingId: string;
}) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function cancelListing(uint256 _listingId)",
    params: [BigInt(listingId)],
  });

  return transaction;
}

export async function getCreateAuction({
  params: _params,
}: {
  params: CreateAuctionType;
}) {
  const startTimestamp = getCurrentBlockchainTimestamp();
  const endTimestamp = convertToBlockchainTimestamp(_params.endTimestamp);

  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    minimumBidAmount: toWei(_params.minimumBidAmount),
    buyoutBidAmount: toWei(_params.buyoutBidAmount),
    timeBufferInSeconds: BigInt(_params.timeBufferInSeconds),
    bidBufferBps: BigInt(_params.bidBufferBps),
    startTimestamp,
    endTimestamp,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function createAuction((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp) _params) returns (uint256 auctionId)",
    params: [formattedParams],
  });

  return transaction;
}

export async function getCancelAuction({ auctionId }: { auctionId: string }) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function cancelAuction(uint256 _auctionId)",
    params: [BigInt(auctionId)],
  });

  return transaction;
}

export async function getBuyFromDirectListing({
  params: _params,
}: {
  params: BuyFromDirectListingType;
}) {
  const currency = _params.currency || nativeCurrency;
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method:
      "function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable",
    params: [
      BigInt(_params.listingId),
      _params.buyFor,
      BigInt(_params.quantity),
      currency,
      toWei(_params.totalPrice),
    ],
  });

  return transaction;
}

export async function getMakeOffer({
  params: _params,
}: {
  params: MakeOfferListingType;
}) {
  const expirationTimestamp = convertToBlockchainTimestamp(
    _params.expirationTimestamp
  );
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency,
    totalPrice: toWei(_params.totalPrice),
    expirationTimestamp,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function makeOffer((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 totalPrice, uint256 expirationTimestamp) _params) returns (uint256 _offerId)",
    params: [formattedParams],
  });

  return transaction;
}

export async function getAcceptOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function acceptOffer(uint256 _offerId)",
    params: [BigInt(offerId)],
  });

  return transaction;
}

export async function getCancelOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function cancelOffer(uint256 _offerId)",
    params: [BigInt(offerId)],
  });

  return transaction;
}

export async function getBidInAuction({
  auctionId,
  bidAmount,
}: {
  auctionId: string;
  bidAmount: string;
}) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method:
      "function bidInAuction(uint256 _auctionId, uint256 _bidAmount) payable",
    params: [BigInt(auctionId), toWei(bidAmount)],
  });

  return transaction;
}

export async function getCollectAuctionPayout({
  auctionId,
}: {
  auctionId: string;
}) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function collectAuctionPayout(uint256 _auctionId)",
    params: [BigInt(auctionId)],
  });

  return transaction;
}

export async function getCollectAuctionTokens({
  auctionId,
}: {
  auctionId: string;
}) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });

  const transaction = await prepareContractCall({
    contract,
    method: "function collectAuctionTokens(uint256 _auctionId)",
    params: [BigInt(auctionId)],
  });

  return transaction;
}
