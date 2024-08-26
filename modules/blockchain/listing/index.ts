import {
  convertToBlockchainTimestamp,
  getCurrentBlockchainTimestamp,
} from "@/utils";
import { MARKETPLACE_CONTRACT } from "@/utils/configs";
import { getContractCustom, nativeCurrency } from "../lib";
import {
  BuyFromDirectListingType,
  CreateDirectListingType,
  MakeOfferListingType,
} from "@/utils/lib/types";
import { prepareContractCall, toWei } from "thirdweb";

/* -------------------------------------------------------------------------------------------------
 * WRITE FUNCTIONS
 * -----------------------------------------------------------------------------------------------*/

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
    value: toWei(_params.totalPrice)
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
