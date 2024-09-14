import { useToast } from '@/modules/app/hooks/useToast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  decimalOffChain,
  decimalOnChain,
  getContractEthers,
  waitForTransaction,
} from '@/modules/blockchain/lib'
import { CROSSFI_MARKETPLACE_CONTRACT, CROSSFI_WRAPPED_TOKEN_CONTRACT } from '@/utils/configs'
import WXFIAbi from '@/utils/abi/wxfi.json'
import { useUserChainInfo } from '@/modules/query'

export function useIncreaseAllowanceMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const approvalTxData = await WXFIContract.populateTransaction.approve(
        CROSSFI_MARKETPLACE_CONTRACT,
        amount,
      )
      // @ts-ignore
      const tx = await activeAccount.sendTransaction(approvalTxData)
      const receipt = await waitForTransaction(tx.transactionHash)

      if (receipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wxfi', 'make-offer', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'Allowance increased successfully',
      },
      errorMessage: {
        description: 'Failed to increase allowance',
      },
    },
  })
}

export function useConvertXFIToWXFIMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const depositTxData = await WXFIContract.populateTransaction.deposit({
        value: decimalOnChain(amount),
      })

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(depositTxData)
      const receipt = await waitForTransaction(tx.transactionHash)

      if (receipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['withdraw-wxfi', 'balance', 'convert-xfi-to-wxfi', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'XFI converted to WXFI successfully',
      },
      errorMessage: {
        description: 'Failed to convert XFI to WXFI',
      },
    },
  })
}

export function useWithdrawWXFIMutation() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const withdraw = await WXFIContract.populateTransaction.withdraw(decimalOnChain(amount))

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(withdraw)
      const receipt = await waitForTransaction(tx.transactionHash)

      if (receipt.status === 'reverted') {
        throw new Error('Transaction failed')
      }

      return receipt
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['withdraw-wxfi', 'balance', 'convert-xfi-to-wxfi', activeAccount?.address],
      })
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: 'WXFI withdrawn successfully',
      },
      errorMessage: {
        description: 'Failed to withdraw WXFI',
      },
    },
  })
}
