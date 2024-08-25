import { getSetApprovalForAll } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useApprovedForAllMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      collectionContractAddress,
    }: {
      collectionContractAddress: string;
    }) => {
      if (!activeAccount) return;

      const transaction = await getSetApprovalForAll({
        collectionContractAddress,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: (_, { collectionContractAddress }) => {
      queryClient.invalidateQueries({
        queryKey: [
          "approval",
          collectionContractAddress,
          activeAccount?.address,
        ],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Approval successfully",
      },
      errorMessage: {
        description: "Error making approval",
      },
    },
  });
}
