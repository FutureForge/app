import {
  CROSSFI_STAKING_CONTRACT,
  CROSSFI_TEST_ASSET_ADDRESS,
} from "@/utils/configs";
import { prepareContractCall, readContract } from "thirdweb";
import { getContractCustom } from "..";

export async function getSetApprovalForAllStaking() {
  const contract = await getContractCustom({
    contractAddress: CROSSFI_TEST_ASSET_ADDRESS,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function setApprovalForAll(address operator, bool approved)",
    params: [CROSSFI_STAKING_CONTRACT, true],
  });

  return transaction;
}

export async function getCheckApprovedForAllStaking({
  walletAddress,
}: {
  walletAddress: string;
}) {
  const contract = getContractCustom({
    contractAddress: CROSSFI_TEST_ASSET_ADDRESS,
  });

  const approved = await readContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: [walletAddress, CROSSFI_STAKING_CONTRACT],
  });

  return approved;
}

export async function getStakeInfo({
  walletAddress,
}: {
  walletAddress: string;
}) {
  const contract = getContractCustom({
    contractAddress: CROSSFI_STAKING_CONTRACT,
  });

  const stakeInfo = await readContract({
    contract,
    method:
      "function getStakeInfo(address _staker) view returns (uint256[] _tokensStaked, uint256 _rewards)",
    params: [walletAddress],
  });

  return stakeInfo;
}

export async function getWithdrawStake({ tokenId }: { tokenId: string }) {
  const contract = getContractCustom({
    contractAddress: CROSSFI_STAKING_CONTRACT,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function withdraw(uint256[] _tokenIds)",
    params: [[BigInt(tokenId)]],
  });

  return transaction;
}

export async function getStake({ tokenId }: { tokenId: string }) {
  const contract = getContractCustom({
    contractAddress: CROSSFI_STAKING_CONTRACT,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function stake(uint256[] _tokenIds)",
    params: [[BigInt(tokenId)]],
  });

  return transaction;
}

export async function getClaimStakingReward() {
  const contract = getContractCustom({
    contractAddress: CROSSFI_STAKING_CONTRACT,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function claimRewards()",
    params: [],
  });

  return transaction;
}
