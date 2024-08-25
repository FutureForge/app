import { getCreateDirectListing } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { CreateDirectListingType } from "@/utils/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useCreateListingMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      directListing,
    }: {
      directListing: Partial<CreateDirectListingType>;
    }) => {
      if (!activeAccount) return;

      const transaction = await getCreateDirectListing({
        params: {
          assetContract: directListing.assetContract ?? "",
          tokenId: directListing.tokenId ?? "",
          quantity: directListing.quantity ?? "",
          pricePerToken: directListing.pricePerToken ?? "",
          endTimestamp: directListing.endTimestamp ?? "",
        },
      });

      console.log("create listing transaction", transaction);

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["newly", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Listing created successfully",
      },
      errorMessage: {
        description: "Failed to create listing",
      },
    },
  });
}
