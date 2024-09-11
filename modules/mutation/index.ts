export { useAddCollectionMutation } from './collection'
export {
  useCreateListingMutation,
  useBuyFromDirectListingMutation,
  useCancelDirectListingMutation,
  useUpdateListingMutation,
} from './listing'
export { useApprovedForAllMutation } from './lib'
export {
  useMakeListingOfferMutation,
  useAcceptOfferMutation,
  useCancelOfferMutation,
  useBidInAuctionMutation,
  useCollectAuctionPayoutMutation,
  useCollectAuctionTokensMutation,
} from './offers'
export { useCreateAuctionMutation, useCancelAuctionMutation } from './auction'
export {
  useApprovedForAllStakingMutation,
  useClaimStakingRewardMutation,
  useStakingMutation,
  useWithdrawStakingMutation,
} from './staking'
export { useCreateNFTMutation } from './create-nft'
export {
  useIncreaseAllowanceMutation,
  useConvertXFIToWXFIMutation,
  useWithdrawWXFIMutation,
} from './wxfi'

import { useMutation, useQueryClient } from '@tanstack/react-query'
// syntax
export function useMutationExample() {
  // call needed functions

  return useMutation({
    mutationFn: async () => {
      // your mutation logic here
    },
    onSuccess: (data, variables, context) => {
      // your success callback here
    },
    onError: (error, variables, context) => {
      // your error callback here
    },
    // other options like retry, etc.
  })
}
