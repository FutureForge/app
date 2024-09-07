import { Icon } from '@/modules/app'
import { Card, StakingLayout } from '@/modules/components/staking'
import { useGetUserStakingInfoQuery } from '@/modules/query'
import Head from 'next/head'
import { NFT } from 'thirdweb'

export default function Withdraw() {
  const {data:withdraw, isLoading, isError} = useGetUserStakingInfoQuery()

  return (
    <>
      <Head>
        <title>MintMingle | Withdraw your NFTs</title>
      </Head>
      <StakingLayout>
        <div className="flex items-center justify-center">
          {!withdraw || withdraw.length === 0 ? (
            <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
              <p className="font-medium">When you stake an NFT, it&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-7 2xl:grid-cols-6 max-lg:grid-cols-3 max-sm:grid-cols-1 max-xsm:grid-cols-2">
              {withdraw?.map((item: NFT) => (
                <Card
                  key={item.metadata.name}
                  title={item.metadata.name}
                  src={item.metadata.image}
                  onClick={() => {}}
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
