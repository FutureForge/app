import {
  getAcceptOffer,
  getBidInAuction,
  getCancelOffer,
  getCollectAuctionPayout,
  getCollectAuctionTokens,
  getMakeOffer,
} from '@/modules/blockchain'
import { decimalOnChain, getContractEthers, waitForTransaction } from '@/modules/blockchain/lib'
import { useUserChainInfo } from '@/modules/query'
import { CROSSFI_MARKETPLACE_CONTRACT, CROSSFI_WRAPPED_TOKEN_CONTRACT } from '@/utils/configs'
import { MakeOfferListingType } from '@/utils/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendAndConfirmTransaction } from 'thirdweb'
import WXFIAbi from '@/utils/abi/wxfi.json'
import { BigNumber, ethers } from 'ethers'
import { useToast } from '@/modules/app/hooks/useToast'
import { useIncreaseAllowanceMutation, useConvertXFIToWXFIMutation } from '..'

export function useMakeListingOfferMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()
  const increaseAllowanceMutation = useIncreaseAllowanceMutation()
  const convertXFIToWXFIMutation = useConvertXFIToWXFIMutation()

  return useMutation({
    mutationFn: async ({ makeOffer }: { makeOffer: Partial<MakeOfferListingType> }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const makeOfferValue = decimalOnChain(makeOffer.totalPrice!)
      const wxfiBalanceRaw = await WXFIContract.balanceOf(activeAccount.address)

      // Step 1: Convert XFI to WXFI if needed
      if (BigNumber.from(wxfiBalanceRaw).lt(makeOfferValue!)) {
        await toast.loading('Wrapping XFI to WXFI')
        await convertXFIToWXFIMutation.mutateAsync({ amount: makeOffer.totalPrice! })

        const updatedWxfiBalance = await WXFIContract.balanceOf(activeAccount.address)
        if (BigNumber.from(updatedWxfiBalance).lt(makeOfferValue!)) {
          throw new Error('Insufficient WXFI balance after conversion')
        }
      }

      // Step 2: Increase allowance if needed
      const currentAllowance = await WXFIContract.allowance(
        activeAccount?.address,
        CROSSFI_MARKETPLACE_CONTRACT,
      )
      if (BigNumber.from(currentAllowance).lt(makeOfferValue!)) {
        await toast.loading('Approving WXFI to spend')
        await increaseAllowanceMutation.mutateAsync({
          amount: makeOfferValue!.toString(),
        })

        const updatedAllowance = await WXFIContract.allowance(
          activeAccount?.address,
          CROSSFI_MARKETPLACE_CONTRACT,
        )
        if (BigNumber.from(updatedAllowance).lt(makeOfferValue!)) {
          throw new Error('Insufficient allowance after approval')
        }
      }

      const transaction = await getMakeOffer({
        params: {
          assetContract: makeOffer.assetContract ?? '',
          tokenId: makeOffer.tokenId ?? '',
          quantity: makeOffer.quantity ?? '',
          currency: CROSSFI_WRAPPED_TOKEN_CONTRACT,
          totalPrice: makeOffer.totalPrice ?? '',
          expirationTimestamp: makeOffer.expirationTimestamp,
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
        queryKey: ['offer', 'nft', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Offer made successfully',
      },
      errorMessage: {
        description: 'Failed to make offer',
      },
    },
  })
}

export function useAcceptOfferMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getAcceptOffer({
        offerId: offerId,
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
        queryKey: ['acceptOffer', 'nft', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Offer Accepted',
      },
      errorMessage: {
        description: 'Failed to accept offer',
      },
    },
  })
}

export function useCancelOfferMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getCancelOffer({
        offerId: offerId,
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
        queryKey: ['cancelOffer', 'event'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Offer Cancelled',
      },
      errorMessage: {
        description: 'Cancel Offer Failed',
      },
    },
  })
}

export function useBidInAuctionMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId, bidAmount }: { auctionId: string; bidAmount: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getBidInAuction({
        auctionId: auctionId,
        bidAmount: bidAmount,
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
        queryKey: ['cancelOffer', 'event'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Bid Placed Successfully',
      },
      errorMessage: {
        description: 'Failed to place bid',
      },
    },
  })
}

export function useCollectAuctionPayoutMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getCollectAuctionPayout({
        auctionId: auctionId,
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
        queryKey: ['cancelOffer', 'event'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Auction payout collected successfully',
      },
      errorMessage: {
        description: 'Failed to collect auction payout',
      },
    },
  })
}

export function useCollectAuctionTokensMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getCollectAuctionTokens({
        auctionId: auctionId,
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
        queryKey: ['cancelOffer', 'event'],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Auction NFT collected successfully',
      },
      errorMessage: {
        description: 'Failed to collect auction NFT',
      },
    },
  })
}
