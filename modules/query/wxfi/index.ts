import { useQuery } from '@tanstack/react-query'
import { useUserChainInfo } from '..'
import { decimalOffChain, decimalOnChain, getContractEthers } from '@/modules/blockchain/lib'
import {
  chainInfo,
  client,
  CROSSFI_MARKETPLACE_CONTRACT,
  CROSSFI_WRAPPED_TOKEN_CONTRACT,
} from '@/utils/configs'
import WXFIAbi from '@/utils/abi/wxfi.json'
import { BigNumber } from 'ethers'
import { useWalletBalance } from 'thirdweb/react'
import { ensureSerializable } from '@/utils'

export function useWXFIAllowanceQuery({ amount }: { amount: string }) {
  const { activeAccount } = useUserChainInfo()

  return useQuery({
    queryKey: ['wxfi', 'allowance', activeAccount?.address],
    queryFn: async () => {
      const WXFIContract = await getContractEthers({
        contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      })

      const amountValue = decimalOnChain(amount)
      const wxfiBalanceRaw = await WXFIContract.balanceOf(activeAccount?.address)
      const wxfiAllowance = await WXFIContract.allowance(
        activeAccount?.address,
        CROSSFI_MARKETPLACE_CONTRACT,
      )

      const isEnoughAllowance = BigNumber.from(wxfiAllowance).lt(amountValue!)
      const isEnoughBalance = BigNumber.from(wxfiBalanceRaw).lt(amountValue!)

      return {
        isEnoughAllowance,
        isEnoughBalance,
      }
    },
    refetchInterval: 5000,
    enabled: !!activeAccount?.address,
  })
}

export function useXFIandWXFIBalanceQuery() {
  const { activeAccount } = useUserChainInfo()

  const { data: xfiBalance, isLoading: xfiBalanceLoading } = useWalletBalance({
    chain: chainInfo,
    address: activeAccount?.address,
    client,
  })

  const { data: wxfiBalance, isLoading: wxfiBalanceLoading } = useWalletBalance({
    chain: chainInfo,
    address: activeAccount?.address,
    client,
    tokenAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
  })

  return useQuery({
    queryKey: ['withdraw-wxfi', 'balance', 'convert-xfi-to-wxfi', activeAccount?.address],
    queryFn: async () => {
      return ensureSerializable({
        xfiBalance,
        wxfiBalance,
      })
    },
    enabled: !!activeAccount?.address && !xfiBalanceLoading && !wxfiBalanceLoading,
    refetchInterval: 5000,
  })
}
