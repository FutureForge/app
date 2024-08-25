import { MARKETPLACE_CONTRACT } from "@/utils/configs";
import { prepareContractCall, readContract } from "thirdweb";
import { getContractCustom } from "../lib";
import { EnglishAuction } from "thirdweb/extensions/marketplace";

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
