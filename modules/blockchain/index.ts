import { chainInfoV2, client, MARKETPLACE_CONTRACT, rpcRequest } from "@/utils";
import {
  eth_blockNumber,
  getContractEvents,
  getContract as getContractThirdweb,
  prepareEvent,
  readContract,
} from "thirdweb";

const fromBlock = 6543730;

export function getContract({ contractAddress }: { contractAddress: string }) {
  // const contract = new ethers.Contract(
  //   MARKETPLACE_CONTRACT,
  //   MarketPlaceInterface,
  //   ethers.getDefaultProvider("sepolia")
  // );
  // return contract;

  if (!contractAddress) throw new Error("Please pass in a contract address");

  const contract = getContractThirdweb({
    client,
    chain: chainInfoV2,
    address: contractAddress,
  });

  return contract;
}

export async function getCurrentBlockNumber() {
  return await eth_blockNumber(rpcRequest);
}

export async function getTotalListings() {
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
  const totalListings = await readContract({
    contract,
    method: "function totalListings() view returns (uint256)",
    params: [],
  });

  return Number(totalListings) - 1;
}

export async function getTotalOffers() {
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
  const totalOffers = await readContract({
    contract,
    method: "function totalOffers() view returns (uint256)",
    params: [],
  });

  return Number(totalOffers) - 1;
}

export async function getTotalAuctions() {
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
  const totalAuctions = await readContract({
    contract,
    method: "function totalAuctions() view returns (uint256)",
    params: [],
  });

  return Number(totalAuctions) - 1;
}

export async function getAllListing() {
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
  const totalAuctions = await getTotalAuctions();

  const allAuctions = await readContract({
    contract,
    method:
      "function getAllAuctions(uint256 _startId, uint256 _endId) view returns ((uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allAuctions)",
    params: [BigInt(0), BigInt(totalAuctions)],
  });

  return allAuctions;
}

export async function getNewListing() {
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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
