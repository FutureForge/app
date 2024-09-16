export {
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
  useGetSingleNFTQuery,
  useCheckIfItsACollectionQuery,
} from './collection'
export {
  useUserChainInfo,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useUserListingQuery,
  useUserAuctionQuery,
} from './user'
export { useCheckApprovedForAllQuery } from './lib'
export { useCheckApprovedForAllStakingQuery, useGetUserStakingInfoQuery } from './staking'
export { useGetGlobalListingOrAuctionQuery } from './global'
export { useWXFIAllowanceQuery, useXFIandWXFIBalanceQuery } from './wxfi'
export { useAbortController } from './useAbortController'

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
