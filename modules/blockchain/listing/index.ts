import { getCurrentBlockchainTimestamp, getEndBlockchainTimestamp } from '@/utils'
import { CROSSFI_MARKETPLACE_CONTRACT } from '@/utils/configs'
import { getContractCustom, nativeCurrency } from '../lib'
import {
  BuyFromDirectListingType,
  CreateDirectListingType,
  MakeOfferListingType,
} from '@/utils/lib/types'
import { prepareContractCall, toWei } from 'thirdweb'
import { createListing } from 'thirdweb/extensions/marketplace'

/* -------------------------------------------------------------------------------------------------
 * WRITE FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

export async function getCreateDirectListing({
  params: _params,
}: {
  params: Partial<CreateDirectListingType>
}) {
  if (!_params.endTimestamp) {
    return
  }

  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  // const formattedParams = {
  //   assetContract: _params.assetContract,
  //   tokenId: BigInt(_params.tokenId),
  //   quantity: BigInt(_params.quantity),
  //   currency: _params.currency || nativeCurrency,
  //   pricePerToken: toWei(_params.pricePerToken),
  //   startTimestamp: startTimestamp,
  //   endTimestamp: endTimestamp,
  //   reserved: _params.reserved || false,
  // }

  // const transaction = await prepareContractCall({
  //   contract,
  //   method:
  //     "function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)",
  //   params: [formattedParams],
  // })

  if (!_params.assetContract || !_params.tokenId || !_params.pricePerToken) {
    return
  }

  const transaction = createListing({
    contract,
    assetContractAddress: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    pricePerToken: _params.pricePerToken,
  })

  return transaction
}

export async function getUpdateDirectListing({
  listingId,
  params: _params,
}: {
  listingId: string
  params: CreateDirectListingType
}) {
  if (!_params.endTimestamp) {
    throw new Error('End timestamp is required')
  }
  const startTimestamp = getCurrentBlockchainTimestamp()
  const endTimestamp =
    getEndBlockchainTimestamp() || BigInt(Math.floor(_params.endTimestamp?.getTime() / 1000))

  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    pricePerToken: toWei(_params.pricePerToken),
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    reserved: _params.reserved || false,
  }

  const transaction = await prepareContractCall({
    contract,
    method:
      'function updateListing(uint256 _listingId, (address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params)',
    params: [BigInt(listingId), formattedParams],
  })

  return transaction
}

export async function getCancelDirectListing({ listingId }: { listingId: string }) {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const transaction = await prepareContractCall({
    contract,
    method: 'function cancelListing(uint256 _listingId)',
    params: [BigInt(listingId)],
  })

  return transaction
}

export async function getBuyFromDirectListing({
  params: _params,
}: {
  params: BuyFromDirectListingType
}) {
  const currency = _params.currency || nativeCurrency
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const transaction = await prepareContractCall({
    contract,
    method:
      'function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable',
    params: [
      BigInt(_params.listingId),
      _params.buyFor,
      BigInt(_params.quantity),
      currency,
      toWei(_params.totalPrice),
    ],
    value: toWei(_params.totalPrice),
  })

  return transaction
}

export async function getMakeOffer({ params: _params }: { params: MakeOfferListingType }) {
  console.log('make offer', _params)

  const expirationTimestamp = getEndBlockchainTimestamp(_params.expirationTimestamp)
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    totalPrice: toWei(_params.totalPrice),
    expirationTimestamp,
  }

  console.log('make offer', formattedParams)

  const transaction = await prepareContractCall({
    contract,
    method:
      'function makeOffer((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 totalPrice, uint256 expirationTimestamp) _params) returns (uint256 _offerId)',
    params: [formattedParams],
    // value: toWei(_params.totalPrice)
  })

  return transaction
}

export async function getAcceptOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const transaction = await prepareContractCall({
    contract,
    method: 'function acceptOffer(uint256 _offerId)',
    params: [BigInt(offerId)],
  })

  return transaction
}

export async function getCancelOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({ contractAddress: CROSSFI_MARKETPLACE_CONTRACT })

  const transaction = await prepareContractCall({
    contract,
    method: 'function cancelOffer(uint256 _offerId)',
    params: [BigInt(offerId)],
  })

  return transaction
}
