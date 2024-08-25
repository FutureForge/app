export {
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
} from "./collection";
export {
  useUserChainInfo,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useUserListingQuery,
  useUserAuctionQuery,
} from "./user";
export { useMarketplaceEventQuery } from "./events";
export { useCheckApprovedForAll } from "./lib";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// syntax
export function useQueryExample() {
  // call needed functions

  return useQuery({
    queryKey: ["exampleQueryKey"],
    queryFn: async () => {},
    initialData: null,
    enabled: true,
    refetchInterval: 60000, // refetch every minute
  });
}
