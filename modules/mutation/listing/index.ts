import { getCreateDirectListing, getMakeOffer } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import {
  CreateDirectListingType,
  MakeOfferListingType,
} from "@/utils/lib/types";
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
