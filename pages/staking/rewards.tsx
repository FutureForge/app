import { Button, Loader } from '@/modules/app'
import { StakingLayout } from '@/modules/components/staking'
import { useClaimStakingRewardMutation } from '@/modules/mutation'
import { useGetUserStakingInfoQuery } from '@/modules/query'
import Head from 'next/head'

export default function Rewards() {
  const claimRewardsMutation = useClaimStakingRewardMutation()

  const { data: stakingInfo, isLoading, isError } = useGetUserStakingInfoQuery()
  const rewards = stakingInfo?.rewards || 0
  const tokensStaked = stakingInfo?.tokensStaked.length || 0

  const handleClaimRewards = () => {
    claimRewardsMutation.mutate()
  }

  if (isLoading || isError) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>MintMingle | Claim Rewards</title>
      </Head>
      <StakingLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-349px)]">
          <div className="p-8 bg-black rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-6">Staking Rewards</h2>
            <div className="mb-6 space-y-4">
              <p className="text-lg">
                Tokens Staked: <span className="font-semibold">{tokensStaked}</span>
              </p>
              <p className="text-lg">
                Available Rewards:{' '}
                <span className="font-semibold">{rewards} MMT (Mint Mingles Token)</span>
              </p>
            </div>
            <Button
              disabled={claimRewardsMutation.isPending || tokensStaked === 0}
              onClick={handleClaimRewards}
              variant="secondary"
              className="w-full h-10"
            >
              Claim Rewards
            </Button>
          </div>
        </div>
      </StakingLayout>
    </>
  )
}
