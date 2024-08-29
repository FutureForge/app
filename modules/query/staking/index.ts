import { useQuery } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import {
  getCheckApprovedForAllStaking,
  getContractCustom,
  getStakeInfo,
} from "@/modules/blockchain";
import { getNFT as getERC721NFT } from "thirdweb/extensions/erc721";
import { TEST_ASSET_ADDRESS } from "@/utils/configs";
import { includeNFTOwner } from "@/modules/blockchain/lib";

export function useCheckApprovedForAllStakingQuery() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["approval-staking"],
    queryFn: async () => {
      if (!activeAccount?.address) return false;

      const isApproved = await getCheckApprovedForAllStaking({
        walletAddress: activeAccount?.address,
      });

      return isApproved;
    },
    enabled: !!activeAccount,
    refetchInterval: 6000,
  });
}

export function useGetUserStakingInfoQuery() {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["user-staking"],
    queryFn: async () => {
      if (!activeAccount?.address) return null; // Return null if no active account

      const contract = getContractCustom({
        contractAddress: TEST_ASSET_ADDRESS,
      });

      const stakeInfo = await getStakeInfo({
        walletAddress: activeAccount.address,
      });

      if (!stakeInfo) return null; // Return null if no staking info is found

      const tokensStaked = stakeInfo[0];
      const rewards = stakeInfo[1];

      const nftsTokenStaked = await Promise.all(
        tokensStaked.map(async (tokenId) => {
          const nft = await getERC721NFT({
            contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          });
          return nft;
        })
      );

      console.log({ tokensStaked, rewards, nftsTokenStaked });

      return { tokensStaked, rewards, nftsTokenStaked };
    },
    enabled: !!activeAccount?.address,
    refetchInterval: 6000,
  });
}
