import { CROSSFI_MARKETPLACE_CONTRACT } from '@/utils/configs'
import { prepareContractCall, readContract } from 'thirdweb'
import { getContractCustom } from '../lib'
import { EnglishAuction } from 'thirdweb/extensions/marketplace'

/* -------------------------------------------------------------------------------------------------
 * READ FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getTotalListings() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalListings = await readContract({
    contract,
    method: 'function totalListings() view returns (uint256)',
    params: [],
  })

  if (Number(totalListings) === 0) {
    return 0
  } else {
    return Number(totalListings) - 1
  }
}

export async function getTotalOffers() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalOffers = await readContract({
    contract,
    method: 'function totalOffers() view returns (uint256)',
    params: [],
  })

  if (Number(totalOffers) === 0) {
    return 0
  } else {
    return Number(totalOffers) - 1
  }
}

export async function getTotalAuctions() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalAuctions = await readContract({
    contract,
    method: 'function totalAuctions() view returns (uint256)',
    params: [],
  })

  if (Number(totalAuctions) === 0) {
    return 0
  } else {
    return Number(totalAuctions) - 1
  }
}

export async function getAllListing() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalListings = await getTotalListings()

  const allListings = await readContract({
    contract,
    method:
      'function getAllListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _allListings)',
    params: [BigInt(0), BigInt(totalListings)],
  })

  return allListings
}

export async function getAllOffers() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalOffers = await getTotalOffers()

  const allOffers = await readContract({
    contract,
    method:
      'function getAllOffers(uint256 _startId, uint256 _endId) view returns ((uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allOffers)',
    params: [BigInt(0), BigInt(totalOffers)],
  })

  return allOffers
}

export async function getAllAuctions() {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })
  const totalAuctions = await getTotalAuctions()

  const allAuctions = await readContract({
    contract,
    method:
      'function getAllAuctions(uint256 _startId, uint256 _endId) view returns ((uint256 auctionId, uint256 tokenId, uint256 quantity, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp, address auctionCreator, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allAuctions)',
    params: [BigInt(0), BigInt(totalAuctions)],
  })

  return allAuctions
}

export async function getCheckApprovedForAll({
  walletAddress,
  collectionContractAddress,
}: {
  walletAddress: string
  collectionContractAddress: string
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  })

  const approved = await readContract({
    contract,
    method: 'function isApprovedForAll(address owner, address operator) view returns (bool)',
    params: [walletAddress, CROSSFI_MARKETPLACE_CONTRACT],
  })

  return approved
}

export async function getSetApprovalForAll({
  collectionContractAddress,
  approved = true,
}: {
  collectionContractAddress: string
  approved?: boolean
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  })

  const transaction = await prepareContractCall({
    contract,
    method: 'function setApprovalForAll(address operator, bool approved)',
    params: [CROSSFI_MARKETPLACE_CONTRACT, approved],
  })

  return transaction
}

export async function getOffer({ offerId }: { offerId: bigint }) {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const offer = await readContract({
    contract,
    method:
      'function getOffer(uint256 _offerId) view returns ((uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status) _offer)',
    params: [offerId],
  })

  return offer
}

export async function getListing({ listingId }: { listingId: bigint }) {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const offer = await readContract({
    contract,
    method:
      'function getOffer(uint256 _offerId) view returns ((uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status) _offer)',
    params: [listingId],
  })

  return offer
}

export async function getPlatformFeeInfo({ contractAddress }: { contractAddress: string }) {
  const contract = getContractCustom({ contractAddress })

  const platformFee = await readContract({
    contract,
    method: 'function getPlatformFeeInfo() view returns (address, uint16)',
    params: [],
  })

  const platformFeeObject = {
    address: platformFee[0] || '0x000000000000000000000000000000000000dEaD',
    percent: platformFee[1] / 100 || 0,
  }

  return platformFeeObject
}
