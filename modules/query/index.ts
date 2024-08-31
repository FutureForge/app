export {
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
  useGetSingleNFTQuery,
} from './collection'
export {
  useUserChainInfo,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useUserListingQuery,
  useUserAuctionQuery,
} from './user'
export { useMarketplaceEventQuery } from './events'
export { useCheckApprovedForAllQuery } from './lib'
export { useCheckApprovedForAllStakingQuery, useGetUserStakingInfoQuery } from './staking'
export { useGetGlobalListingOrAuctionQuery } from './global'

import { useQuery, useQueryClient } from '@tanstack/react-query'

// syntax
export function useQueryExample() {
  // call needed functions

  return useQuery({
    queryKey: ['exampleQueryKey'],
    queryFn: async () => {},
    initialData: null,
    enabled: true,
    refetchInterval: 60000, // refetch every minute
  })
}
