import { chainInfoV2, client, MARKETPLACE_CONTRACT } from "@/utils";
import { getContract as getContractThirdweb, readContract } from "thirdweb";

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
