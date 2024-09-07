import { Icon, Loader } from '@/modules/app'
import { Card, StakingLayout } from '@/modules/components/staking'
import { useApprovedForAllStakingMutation, useStakingMutation } from '@/modules/mutation'
import { useCheckApprovedForAllStakingQuery, useUserNFTsQuery } from '@/modules/query'
import { CROSSFI_TEST_ASSET_ADDRESS } from '@/utils/configs'
import Head from 'next/head'
import { useMemo } from 'react'
import { NFT } from 'thirdweb'

type NFTHolding = {
  address: string
  balance: string
  blockNumber: number
  contractAddress: string
  decimals: null
  timestamp: string
  tokenIds: string[]
  tokenName: string
  tokenSymbol: string
  tokenType: string
  nft: NFT
}

export default function Staking() {
  const { data: checkApprovedForAllStaking } = useCheckApprovedForAllStakingQuery()
  const { data: staking, isLoading, isError } = useUserNFTsQuery()

  const stakingData = useMemo(() => {
    if (!staking) return []

    return staking.filter(
      (item: NFTHolding) =>
        item.contractAddress.toLowerCase() === CROSSFI_TEST_ASSET_ADDRESS.toLowerCase(),
    )
  }, [staking]) as NFTHolding[]

  const approvedForAllStakingMutation = useApprovedForAllStakingMutation()
  const stakingMutation = useStakingMutation()

  const isTxPending = approvedForAllStakingMutation.isPending || stakingMutation.isPending

  const handleStakeNFT = async (tokenId: string) => {
    stakingMutation.mutate({ tokenId })
  }

  const handleApproveNFT = async (tokenId: string) => {
    approvedForAllStakingMutation.mutate()
  }

  if (isLoading || isError) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>MintMingle | Stake your NFTs</title>
      </Head>
      <StakingLayout>
        <div className="flex items-center justify-center">
          {!stakingData || stakingData.length === 0 ? (
            <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
              <p className="font-medium">
                You don&apos;t own any MINT MINGLE COLLECTION NFT NFT try buying one
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-7 2xl:grid-cols-6 max-lg:grid-cols-3 max-sm:grid-cols-1 max-xsm:grid-cols-2">
              {stakingData?.map((item, index) => (
                <Card
                  key={index}
                  title={item.nft.metadata.name}
                  src={item.nft.metadata.image || '/logo.svg'}
                  onClick={checkApprovedForAllStaking ? handleStakeNFT : handleApproveNFT}
                  tokenId={item.nft.id.toString()}
                  disabled={isTxPending}
                  cta={
                    <span className="flex gap-2 items-center">
                      {checkApprovedForAllStaking ? 'Stake' : 'Approve'}
                      <Icon iconType="coins" className="w-4 text-white" />
                    </span>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </StakingLayout>
    </>
  )
}
