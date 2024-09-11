import { Button, TextField } from '@/modules/app'
import { useToast } from '@/modules/app/hooks/useToast'
import { useConvertXFIToWXFIMutation, useWithdrawWXFIMutation } from '@/modules/mutation'
import { useUserChainInfo, useXFIandWXFIBalanceQuery } from '@/modules/query'
import React, { useState } from 'react'

function to3DP(value: number | string | undefined): string {
  return Number(value).toFixed(3)
}

enum SwapType {
  Wrap,
  Unwrap,
}

export default function SwapPage() {
  const toast = useToast()
  const { activeAccount } = useUserChainInfo()
  const [swapType, setSwapType] = useState<SwapType>(SwapType.Wrap)
  const [amount, setAmount] = useState('')

  const { data: xfiAndWXFIBalanceQuery } = useXFIandWXFIBalanceQuery()
  const { xfiBalance, wxfiBalance } = xfiAndWXFIBalanceQuery || {}

  const withdrawWXFIMutation = useWithdrawWXFIMutation()
  const convertXFITOWXFIMutation = useConvertXFIToWXFIMutation()

  const isTxPending = convertXFITOWXFIMutation.isPending || withdrawWXFIMutation.isPending

  const handleSwap = () => {
    if (!activeAccount) return toast.error('Please connect your wallet')
    if (!amount) return toast.error('Please enter an amount')

    if (swapType === SwapType.Wrap) {
      convertXFITOWXFIMutation.mutate({ amount })
    } else {
      withdrawWXFIMutation.mutate({ amount })
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const maxBalance =
      swapType === SwapType.Wrap
        ? Number(xfiBalance?.displayValue || 0)
        : Number(wxfiBalance?.displayValue || 0)

    if (value === '' || (Number(value) <= maxBalance && /^\d*\.?\d{0,3}$/.test(value))) {
      setAmount(value)
    }
  }

  const handleMaxClick = () => {
    const maxBalance =
      swapType === SwapType.Wrap ? xfiBalance?.displayValue : wxfiBalance?.displayValue
    setAmount(to3DP(maxBalance))
  }

  return (
    <div className="container mx-auto max-w-md mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Swap</h1>
      <div className="flex mb-6">
        <Button
          onClick={() => setSwapType(SwapType.Wrap)}
          variant={swapType === SwapType.Wrap ? 'secondary' : 'primary'}
          className="flex-1 mr-2"
        >
          Wrap
        </Button>
        <Button
          onClick={() => setSwapType(SwapType.Unwrap)}
          variant={swapType === SwapType.Unwrap ? 'secondary' : 'primary'}
          className="flex-1 ml-2"
        >
          Unwrap
        </Button>
      </div>

      <div className="mb-6">
        <p className="mb-2">
          Native Balance:{' '}
          <span className="font-semibold">
            {to3DP(xfiBalance?.displayValue || '0')} {xfiBalance?.symbol}
          </span>
        </p>
        <p>
          Wrapped Balance:{' '}
          <span className="font-semibold">
            {to3DP(wxfiBalance?.displayValue || '0')} {wxfiBalance?.symbol}
          </span>
        </p>
      </div>

      <div className="mb-4">
        <TextField
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder={`Amount to ${swapType === SwapType.Wrap ? 'Wrap' : 'Unwrap'}`}
          className="w-full"
        />
      </div>

      <div className="flex mb-6">
        <Button onClick={handleMaxClick} variant="secondary" className="w-full">
          Max
        </Button>
      </div>

      <Button
        onClick={handleSwap}
        disabled={isTxPending || !amount}
        variant="primary"
        className="w-full"
      >
        {swapType === SwapType.Wrap ? 'Wrap' : 'Unwrap'}
      </Button>
    </div>
  )
}
