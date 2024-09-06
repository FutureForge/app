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
import { BigNumber } from 'ethers'

export function useMakeListingOfferMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ makeOffer }: { makeOffer: Partial<MakeOfferListingType> }) => {
      if (!activeAccount) return

      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const makeOfferValue = decimalOnChain(makeOffer.totalPrice!)
      const wxfiBalanceRaw = await WXFIContract.balanceOf(activeAccount.address)
      const wxfiAllowance = await WXFIContract.allowance(
        activeAccount?.address,
        CROSSFI_MARKETPLACE_CONTRACT,
      )

      if (BigNumber.from(wxfiBalanceRaw).lt(makeOfferValue!)) {
        try {
          const depositTxData = await WXFIContract.populateTransaction.deposit({
            value: makeOfferValue,
          })

          // @ts-ignore
          const tx = await activeAccount.sendTransaction(depositTxData)
          const receipt = await waitForTransaction(tx.transactionHash)

          if (receipt.status === 'reverted') {
            throw new Error('Transaction failed')
          }

          const newWxfiBalanceRaw = await WXFIContract.balanceOf(activeAccount.address)
          if (BigNumber.from(newWxfiBalanceRaw).lt(makeOfferValue!)) {
            throw new Error('Insufficient balance even after deposit')
          }
        } catch (error) {
          throw new Error('Failed to wrapper XFI to WXFI')
        }
      }

      if (BigNumber.from(wxfiAllowance).lt(makeOfferValue!)) {
        try {
          const approvalTxData = await WXFIContract.populateTransaction.approve(
            CROSSFI_MARKETPLACE_CONTRACT,
            makeOfferValue,
          )
          // @ts-ignore
          const tx = await activeAccount.sendTransaction(approvalTxData)
          const receipt = await waitForTransaction(tx.transactionHash)

          if (receipt.status === 'reverted') {
            throw new Error('Transaction failed')
          }
        } catch (error) {
          throw new Error('Approval failed')
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
        queryKey: ['offer', 'event', 'nft'],
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
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return

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

export function useCancelOfferMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) return

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
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId, bidAmount }: { auctionId: string; bidAmount: string }) => {
      if (!activeAccount) return

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
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return

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
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) return

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
