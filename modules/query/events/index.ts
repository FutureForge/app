import {
  getNewListing,
  getNewAuction,
  getNewBid,
  getNewOffer,
  getRecentlySold,
  getNewSale,
} from "@/modules/blockchain";
import { useQuery } from "@tanstack/react-query";

export function useMarketplaceEventQuery() {
  return useQuery({
    queryKey: [
      "newlyListedEvents",
      "listed",
      "newly",
      "auction",
      "bid",
      "offer",
      "sale",
    ],
    queryFn: async () => {
      const [newListing, newAuction, newBid, newOffer, recentlySold, newSale] =
        await Promise.all([
          getNewListing(),
          getNewAuction(),
          getNewBid(),
          getNewOffer(),
          getRecentlySold(),
          getNewSale(),
        ]);

      return {
        newListing,
        newAuction,
        newBid,
        newOffer,
        recentlySold,
        newSale,
      };
    },
    initialData: {
      newListing: [],
      newAuction: [],
      newBid: [],
      newOffer: [],
      recentlySold: [],
      newSale: [],
    },
    refetchInterval: 60000 * 5,
  });
}
