'use Client'
import { Button, cn, Icon, Loader } from '@/modules/app'
import { FilterButtons } from '@/modules/components/header/components/filter'
import { Header } from '@/modules/components/profile'
import { useGetSingleCollectionQuery } from '@/modules/query'
import { client } from '@/utils/configs'
import { NFTTypeV2, SingleNFTResponse } from '@/utils/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { motion } from 'framer-motion'

type FilterType = 'Items' | 'Offers'
const filters: FilterType[] = ['Items', 'Offers']

type PicksType = 'Listed' | 'Token ID' | 'Auction'

const picks: PicksType[] = ['Listed', 'Token ID', 'Auction']

export default function CollectionPage() {
  const router = useRouter()
  const { contractAddress } = router.query
  const [filter, setFilter] = useState<FilterType>('Items')

  const {
    data: singleCollection,
    isLoading,
    error,
  } = useGetSingleCollectionQuery({
    contractAddress: contractAddress as string,
  })

  return (
    <div className="md:px-14 px-4 flex flex-col max-xsm:items-center gap-8 relative w-full h-full">
      <Header
        collection
        floorPrice={singleCollection.floorPrice}
        totalVolume={singleCollection.totalVolume}
        listed={singleCollection.percentageOfListed}
      />
      <div className="lg:ml-52 z-50 max-w-[90%] max-md:max-w-full max-md:w-full overflow-x-scroll scrollbar-none">
        <FilterButtons collection filter={filter} setFilter={setFilter} filters={filters} data={picks} />
      </div>

      <div>
        {isLoading || error ? (
          <Loader className="h-[80vh]" />
        ) : (
          <div className="w-full grid py-10 grid-cols-4 gap-x-7 gap-y-10 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 max-xsm:grid-cols-1">
            {singleCollection.nfts.map((item: SingleNFTResponse) => (
              <Card
                key={item.blockNumber}
                imageUrl={item.metadata.image}
                type={'CFC-721'}
                tokenId={item.tokenId}
                contractAddress={item.contractAddress}
                name={item.metadata.name}
                pricePerToken={1.63}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type NFTCardProps = {
  pricePerToken?: number
  tokenId?: string
  contractAddress?: string
  type?: NFTTypeV2
  imageUrl?: string
  name?: string
}

function Card(props: NFTCardProps) {
  const { pricePerToken, tokenId, contractAddress, type = 'CFC-721', imageUrl, name } = props
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Link
      href={`/nft/${contractAddress}/${type}/${tokenId}`}
      className="flex-grow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full relative rounded-2xl flex flex-col group bg-primary overflow-hidden">
        <div className="w-full h-[70%] overflow-hidden rounded-2xl">
          <MediaRenderer
            client={client}
            src={imageUrl}
            className="rounded-2xl w-full h-[70%]  group-hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>

        <div className="p-4 rounded-br-2xl rounded-bl-2xl flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <p className={cn('font-semibold whitespace-nowrap')}>{name}</p>

            <div className="flex w-full justify-between items-center">
              <span>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold">{pricePerToken} XFI</p>
              </span>

              <span className="flex items-center gap-2">
                <Image src={'/Avatar Placeholder.png'} alt="placeholder" width={30} height={30} />
                <p>MoonDancer</p>
              </span>
            </div>
            {isHovered && (
              <motion.div
                initial={{ y: 60 }}
                animate={{ y: isHovered ? 0 : 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute bottom-2 left-4 right-4"
              >
                <Button variant="secondary" className="h-[41px] flex gap-3 items-center">
                  Offer/Bid/Buy <Icon iconType={'cart'} className="w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
