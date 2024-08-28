import { chainInfoV2, client, rpcRequest } from "@/utils/configs";
import { ethers } from "ethers";
import { eth_blockNumber, getContract as getContractThirdweb } from "thirdweb";

export const fromBlock = 6543730;
export const nativeCurrency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export function getContractCustom({
  contractAddress,
}: {
  contractAddress: string;
}) {
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

export function decimalOffChain(
  number: bigint | string | number,
  decimalPlaces: string = "ethers"
) {
  const value = ethers.utils.formatEther(number);

  return value;
}
