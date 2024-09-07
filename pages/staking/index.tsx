import { Icon, Loader } from '@/modules/app'
import { Card, StakingLayout } from '@/modules/components/staking'
import { useUserNFTsQuery } from '@/modules/query'
import Head from 'next/head'
import { NFT } from 'thirdweb'

export default function Staking() {
  const { data: staking, isLoading, isError } = useUserNFTsQuery()

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return (
      <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
        <p className="font-medium">Failed to load staking data. Please try again later.</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>MintMingle | Stake your NFTs</title>
      </Head>
      <StakingLayout>
        <div className="flex items-center justify-center">
          {!staking || staking.length === 0 ? (
            <div className="w-full h-[calc(100vh-349px)] flex items-center justify-center">
              <p className="font-medium">When you stake an NFT, it&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-7 2xl:grid-cols-6 max-lg:grid-cols-3 max-sm:grid-cols-1 max-xsm:grid-cols-2">
              {staking?.map((item: NFT) => (
                <Card
                  key={item.metadata.name}
                  title={item.metadata.name}
                  src={item.metadata.image}
                  onClick={() => {}}
                  cta={
                    <span className="flex gap-2 items-center">
                      Stake
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

type stakeProps = {
  src: string
  title: string
}
const stake = [
  {
    src: '/Image.png',
    title: '1',
  },
  {
    src: '/Image.png',
    title: '2',
  },
  {
    src: '/Image.png',
    title: '3',
  },
  {
    src: '/Image.png',
    title: '4',
  },
  {
    src: '/Image.png',
    title: '5',
  },
  {
    src: '/Image.png',
    title: '6',
  },
  {
    src: '/Image.png',
    title: '7',
  },
  {
    src: '/Image.png',
    title: '8',
  },
  {
    src: '/Image.png',
    title: '9',
  },
  {
    src: '/Image.png',
    title: '10',
  },
  {
    src: '/Image.png',
    title: '11',
  },
  {
    src: '/Image.png',
    title: '12',
  },
  {
    src: '/Image.png',
    title: '13',
  },
  {
    src: '/Image.png',
    title: '14',
  },
]
