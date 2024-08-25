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
      "newly",
      "auction",
      "bid",
      "offer",
      "sale",
      "event",
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
