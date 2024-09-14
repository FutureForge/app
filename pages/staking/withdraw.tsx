import { Icon, Loader } from '@/modules/app'
import { Card, StakingLayout } from '@/modules/components/staking'
import { useWithdrawStakingMutation } from '@/modules/mutation'
import { useGetUserStakingInfoQuery } from '@/modules/query'
import Head from 'next/head'
import { NFT } from 'thirdweb'
import { NFTHolding } from '.'

export default function Withdraw() {
  const { data: withdraw, isLoading, isError } = useGetUserStakingInfoQuery()
  const withdrawStakeMutation = useWithdrawStakingMutation()

  const handleWithdrawStakedNFT = (tokenId: string) => {
    withdrawStakeMutation.mutate({ tokenId })
  }

  if (isLoading || isError) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>MintMingle | Withdraw your NFTs</title>
      </Head>
      <StakingLayout>
        <div className="flex items-center justify-center">
          {!withdraw?.nftsTokenStaked || withdraw?.nftsTokenStaked?.length === 0 ? (
            <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
              <p className="font-medium">When you stake an NFT, it&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-7 2xl:grid-cols-6 max-lg:grid-cols-3 max-sm:grid-cols-1 max-xsm:grid-cols-2">
              {withdraw?.nftsTokenStaked?.map((item: NFTHolding) => (
                <Card
                  key={item?.nft?.metadata?.name}
                  title={item?.nft?.metadata?.name}
                  src={item?.nft?.metadata?.image}
                  onClick={handleWithdrawStakedNFT}
                  tokenId={item.nft?.id?.toString() || item.nft?.tokenId?.toString() || ''}
                  disabled={withdrawStakeMutation.isPending}
                  cta={
                    <span className="flex gap-2 items-center">
                      Withdraw
                      <Icon iconType="arrow" className="w-4 text-white" />
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
