import { getCancelAuction, getCreateAuction } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { CreateAuctionType } from "@/utils/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useCreateAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      auctionDetails,
    }: {
      auctionDetails: Partial<CreateAuctionType>;
    }) => {
      if (!activeAccount) return;

      const transaction = await getCreateAuction({
        params: {
          assetContract: auctionDetails.assetContract ?? "",
          tokenId: auctionDetails.tokenId ?? "",
          quantity: auctionDetails.quantity ?? "",
          bidBufferBps: auctionDetails.bidBufferBps ?? "",
          buyoutBidAmount: auctionDetails.buyoutBidAmount ?? "",
          minimumBidAmount: auctionDetails.minimumBidAmount ?? "",
          timeBufferInSeconds: auctionDetails.timeBufferInSeconds ?? "",
          startTimestamp: auctionDetails.startTimestamp ?? "",
          endTimestamp: auctionDetails.endTimestamp ?? "",
          currency: auctionDetails.currency ?? "",
        },
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userAuction"],
      });
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: "Auction created successfully",
      },
      errorMessage: {
        description: "Failed to create auction",
      },
    },
  });
}

export function useCancelAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return;

      const transaction = await getCancelAuction({
        auctionId: auctionId,
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "listing", "auction"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Auction Cancelled",
      },
      errorMessage: {
        description: "Cancel Auction Failed",
      },
    },
  });
}
