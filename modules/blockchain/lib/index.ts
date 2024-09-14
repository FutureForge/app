import {
  chainInfoV2,
  client,
  rpcRequest,
  chainInfo,
  CROSSFI_MARKETPLACE_CONTRACT,
} from '@/utils/configs'
import { ethers } from 'ethers'
import { eth_blockNumber, getContract as getContractThirdweb, Hex, waitForReceipt } from 'thirdweb'
import MarketplaceABI from '@/utils/abi/marketplaceABI.json'

export const includeNFTOwner = true
export const fromBlock = 4880746
export const nativeCurrency = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const providerUrl = 'https://crossfi-testnet-jsonrpc.itrocket.net'

export const provider = new ethers.providers.JsonRpcProvider(providerUrl)

export const ETHERS_CONTRACT = new ethers.Contract(
  CROSSFI_MARKETPLACE_CONTRACT,
  MarketplaceABI,
  provider,
)

export function getContractEthers({ contractAddress, abi }: { contractAddress: string; abi: any }) {
  const contract = new ethers.Contract(contractAddress, abi, provider)
  return contract
}

// const eventFilters = contract.filters.NewListing()
// console.log({ eventFilters })

export function getContractCustom({ contractAddress }: { contractAddress: string }) {
  // const contract = new ethers.Contract(
  //   CROSSFI_MARKETPLACE_CONTRACT,
  //   MarketPlaceInterface,
  //   ethers.getDefaultProvider("sepolia")
  // );
  // return contract;

  const contract = getContractThirdweb({
    client,
    chain: chainInfo,
    address: contractAddress!,
  })

  return contract
}

export async function getCurrentBlockNumber() {
  return await eth_blockNumber(rpcRequest)
}

export function decimalOffChain(number: bigint | string | number) {
  if (!number) return
  const value = ethers.utils.formatEther(number)

  return value
}

export function decimalOnChain(number: bigint | string | number) {
  if (!number) return
  const value = ethers.utils.parseEther(number.toString())

  return value
}

export async function waitForTransaction(txHash: string) {
  const receipt = await waitForReceipt({
    client,
    chain: chainInfo,
    transactionHash: txHash as Hex,
  })

  return receipt
}
