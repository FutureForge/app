import React from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'
import { Button } from '@/modules/app'
import { useRouter } from 'next/router'
import { useGetSingleNFTQuery } from '@/modules/query'
import { NFTType } from '@/utils/lib/types'

const OFFERS = [
  {
    label: 'best offer',
    value: '0.03455 ETH',
  },
  {
    label: 'token type',
    value: 'ERC-417',
  },
  {
    label: 'token id',
    value: '#432',
  },
  {
    label: 'supple',
    value: '3000+',
  },
]
export default function NFTDetailsPage() {
  // const router = useRouter()
  // const { contractAddress, nftType, tokenId } = router.query

  // const {
  //   data: nft,
  //   isLoading,
  //   isError,
  // } = useGetSingleNFTQuery({
  //   contractAddress: contractAddress as string,
  //   nftType: nftType as NFTType,
  //   tokenId: tokenId as string,
  // })

  // if (isLoading) return <p>Loading...</p>
  // if (isError) return <p>Error loading NFT details.</p>
  return (
    <div className="container mx-auto md:px-14 px-4 h-[80vh] items-center justify-center flex mt-5">
      <div className="grid grid-cols-2 w-full  gap-12">
        <div className="">
          <MediaRenderer
            client={client}
            src={'/Asset.png'}
            className="w-full rounded-lg shadow-lg h-full"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className=" flex flex-col gap-8">
            <span className="flex flex-col gap-4 pb">
              <h3 className="text-[30px] font-semibold">Super Hero #423</h3>
              <p>
                Owned by <span className="text-special">Unique</span>
              </p>
            </span>
            <div>
              <p className="font-semibold border-b border-b-white/25 pb-7">Description</p>

              <div className="pt-7">
                <p className="text-[#8A939B]">
                  By <span className="font-semibold text-foreground">Producers</span>
                </p>

                <p className="text-sm mt-2">
                  Producers is a collection of 3,500 unique Producer NFTs - digital collectibles
                  living on the Ethereum blockchain. Your Beatopian Producer comes with the keys to
                  the Producer Portal - your digital
                </p>
              </div>
            </div>
          </div>

          <div className="bg-special-bg w-full p-8 flex items-center justify-center flex-col gap-6 rounded-2xl">
            <div className="flex items-center justify-between w-full">
              {OFFERS.map((offer, index) => {
                const { label, value } = offer

                return (
                  <div key={index} className="flex flex-col gap-2">
                    <p className="capitalize">{label}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                  </div>
                )
              })}
            </div>

            <Button variant="secondary" className="text-sm font-medium h-8">
              Make offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
