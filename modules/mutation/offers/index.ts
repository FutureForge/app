import {
  getAcceptOffer,
  getBidInAuction,
  getCancelOffer,
  getCollectAuctionPayout,
  getCollectAuctionTokens,
  getMakeOffer,
} from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { MakeOfferListingType } from "@/utils/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useMakeListingOfferMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      makeOffer,
    }: {
      makeOffer: Partial<MakeOfferListingType>;
    }) => {
      if (!activeAccount) return;

      console.log('make offer', makeOffer);

      const transaction = await getMakeOffer({
        params: {
          assetContract: makeOffer.assetContract ?? "",
          tokenId: makeOffer.tokenId ?? "",
          quantity: makeOffer.quantity ?? "",
          currency: makeOffer.currency ?? "",
          totalPrice: makeOffer.totalPrice ?? "",
          expirationTimestamp: makeOffer.expirationTimestamp ?? "",
        },
      });

      console.log('make offer', transaction);

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
        queryKey: ["offer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Offer made successfully",
      },
      errorMessage: {
        description: "Failed to make offer",
      },
    },
  });
}

export function useAcceptOfferMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return;

      const transaction = await getAcceptOffer({
        offerId: offerId,
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
        queryKey: ["cancelOffer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Offer Cancelled",
      },
      errorMessage: {
        description: "Cancel Offer Failed",
      },
    },
  });
}

export function useCancelOfferMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return;

      const transaction = await getCancelOffer({
        offerId: offerId,
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
        queryKey: ["cancelOffer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Offer Cancelled",
      },
      errorMessage: {
        description: "Cancel Offer Failed",
      },
    },
  });
}

export function useBitInAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      auctionId,
      bidAmount,
    }: {
      auctionId: string;
      bidAmount: string;
    }) => {
      if (!activeAccount) return;

      const transaction = await getBidInAuction({
        auctionId: auctionId,
        bidAmount: bidAmount,
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
        queryKey: ["cancelOffer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Bid Placed Successfully",
      },
      errorMessage: {
        description: "Failed to place bid",
      },
    },
  });
}

export function useCollectAuctionPayoutMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return;

      const transaction = await getCollectAuctionPayout({
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
        queryKey: ["cancelOffer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Auction payout collected successfully",
      },
      errorMessage: {
        description: "Failed to collect auction payout",
      },
    },
  });
}

export function useCollectAuctionTokensMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return;

      const transaction = await getCollectAuctionTokens({
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
        queryKey: ["cancelOffer", "event"],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: "Auction NFT collected successfully",
      },
      errorMessage: {
        description: "Failed to collect auction NFT",
      },
    },
  });
}
