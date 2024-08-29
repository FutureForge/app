import { getAllAuctions, getAllListing } from "@/modules/blockchain";
import { getWinningBid } from "@/modules/blockchain/auction";
import { StatusType } from "@/utils/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetGlobalListingOrAuctionQuery() {
  return useQuery({
    queryKey: ["global-query"],
    queryFn: async () => {
      const [allAuctions, allListing] = await Promise.all([
        getAllAuctions(),
        getAllListing(),
      ]);

      const createdAuction = allAuctions.filter(
        (auction) => auction.status === StatusType.CREATED
      );

      const updatedAuction = await Promise.all(
        createdAuction.map(async (auction) => {
          const winningBid = await getWinningBid({
            auctionId: auction.auctionId,
          });

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2],
          };

          return { ...auction, winningBid: winningBidBody };
        })
      );

      const updatedListing = allListing.filter(
        (listing) => listing.status === StatusType.CREATED
      );

      return {
        allAuction: updatedAuction,
        allListing: updatedListing,
      };
    },
    initialData: null,
    enabled: true,
    refetchInterval: 6000,
  });
}
