import { useQuery } from "@tanstack/react-query";
import { useUserChainInfo } from "../user";
import { getCheckApprovedForAll } from "@/modules/blockchain";

export function useCheckApprovedForAllQuery(collectionContractAddress: string) {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["approval", collectionContractAddress, activeAccount?.address],
    queryFn: async () => {
      if (!activeAccount?.address) return false;

      const isApproved = await getCheckApprovedForAll({
        collectionContractAddress,
        walletAddress: activeAccount?.address,
      });

      return isApproved;
    },
    enabled: !!activeAccount && !!collectionContractAddress,
    refetchInterval: 6000,
  });
}
