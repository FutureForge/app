import { chainInfoV2, client, rpcRequest, chainInfo, CROSSFI_MARKETPLACE_CONTRACT } from '@/utils/configs'
import { ethers } from 'ethers'
import { eth_blockNumber, getContract as getContractThirdweb } from 'thirdweb'
import MarketplaceABI from '@/utils/marketplaceABI.json'

export const includeNFTOwner = true
export const fromBlock = 4880746
export const nativeCurrency = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const providerUrl = 'https://rpc.testnet.ms'

const provider = new ethers.providers.JsonRpcProvider(providerUrl)

export const ETHERS_CONTRACT = new ethers.Contract(CROSSFI_MARKETPLACE_CONTRACT, MarketplaceABI, provider)

// const eventFilters = contract.filters.NewListing()
// console.log({ eventFilters })

export function getContractCustom({ contractAddress }: { contractAddress: string }) {
  // const contract = new ethers.Contract(
  //   CROSSFI_MARKETPLACE_CONTRACT,
  //   MarketPlaceInterface,
  //   ethers.getDefaultProvider("sepolia")
  // );
  // return contract;

  if (!contractAddress) throw new Error('Please pass in a contract address')

  const contract = getContractThirdweb({
    client,
    chain: chainInfo,
    address: contractAddress,
  })

  return contract
}

export async function getCurrentBlockNumber() {
  return await eth_blockNumber(rpcRequest)
}

export function decimalOffChain(
  number: bigint | string | number,
  decimalPlaces: string = 'ethers',
) {
  const value = ethers.utils.formatEther(number)

  return value
}
