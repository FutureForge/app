import {
  getBuyFromDirectListing,
  getCancelDirectListing,
  getCreateDirectListing,
  getUpdateDirectListing,
} from '@/modules/blockchain'
import { useUserChainInfo } from '@/modules/query'
import { BuyFromDirectListingType, CreateDirectListingType } from '@/utils/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendAndConfirmTransaction } from 'thirdweb'

export function useCreateListingMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ directListing }: { directListing: Partial<CreateDirectListingType> }) => {
      if (!activeAccount) return

      const transaction = await getCreateDirectListing({
        params: {
          assetContract: directListing.assetContract ?? '',
          tokenId: directListing.tokenId ?? '',
          pricePerToken: directListing.pricePerToken ?? '',
          endTimestamp: directListing.endTimestamp,
        },
      })

      if (!transaction) throw new Error('Failed to create listing')

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      })

      if (transactionReceipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return transactionReceipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['newly', 'event'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Listing created successfully',
      },
      errorMessage: {
        description: 'Failed to create listing',
      },
    },
  })
}
export function useUpdateListingMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({
      listingId,
      directListing,
    }: {
      listingId: string
      directListing: Partial<CreateDirectListingType>
    }) => {
      if (!activeAccount) return

      const transaction = await getUpdateDirectListing({
        listingId,
        params: {
          assetContract: directListing.assetContract ?? '',
          tokenId: directListing.tokenId ?? '',
          quantity: directListing.quantity ?? '',
          pricePerToken: directListing.pricePerToken ?? '',
          endTimestamp: directListing.endTimestamp ?? new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      })

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      })

      if (transactionReceipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return transactionReceipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userListing'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Listing updated successfully',
      },
      errorMessage: {
        description: 'Failed to update listing',
      },
    },
  })
}

export function useCancelDirectListingMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ listingId }: { listingId: string }) => {
      if (!activeAccount) return

      const transaction = await getCancelDirectListing({
        listingId,
      })

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      })

      if (transactionReceipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return transactionReceipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userListing'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Listing cancelled',
      },
      errorMessage: {
        description: 'Failed to cancel listing',
      },
    },
  })
}

export function useBuyFromDirectListingMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({
      buyFromListing,
    }: {
      buyFromListing: Partial<BuyFromDirectListingType>
    }) => {
      if (!activeAccount) return

      const transaction = await getBuyFromDirectListing({
        params: {
          buyFor: buyFromListing.buyFor || activeAccount.address,
          currency: buyFromListing.currency ?? '',
          listingId: buyFromListing.listingId ?? '',
          quantity: buyFromListing.quantity ?? '',
          nativeTokenValue: buyFromListing.nativeTokenValue ?? '',
          totalPrice: buyFromListing.totalPrice ?? '',
        },
      })

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      })

      if (transactionReceipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return transactionReceipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userListing'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Listing bought',
      },
      errorMessage: {
        description: 'Failed to buy listing',
      },
    },
  })
}
