import { useToast } from '@/modules/app/hooks/useToast'
import {
  getClaimStakingReward,
  getSetApprovalForAllStaking,
  getStake,
  getWithdrawStake,
} from '@/modules/blockchain'
import { useUserChainInfo } from '@/modules/query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendAndConfirmTransaction } from 'thirdweb'

export function useApprovedForAllStakingMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async () => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getSetApprovalForAllStaking()

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
        queryKey: ['approval-staking', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Approval successfully',
      },
      errorMessage: {
        description: 'Error making approval',
      },
    },
  })
}

export function useWithdrawStakingMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ tokenId }: { tokenId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getWithdrawStake({ tokenId })

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
        queryKey: ['withdraw-staking', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Staking withdrawal successfully',
      },
      errorMessage: {
        description: 'Error withdrawing staking',
      },
    },
  })
}

export function useStakingMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ tokenId }: { tokenId: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getStake({ tokenId })

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
        queryKey: ['staking', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Staking successfully',
      },
      errorMessage: {
        description: 'Error staking',
      },
    },
  })
}

export function useClaimStakingRewardMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async () => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const transaction = await getClaimStakingReward()

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
        queryKey: ['claim-stake-rewards', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Reward claimed successfully',
      },
      errorMessage: {
        description: 'Error claiming reward',
      },
    },
  })
}
