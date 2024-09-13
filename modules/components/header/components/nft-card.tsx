import React from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'
import { Icon } from '@/modules/app'
import { decimalOffChain } from '@/modules/blockchain'
import Link from 'next/link'
import { NFTTypeV2, SingleNFTResponse } from '@/utils/lib/types'
import { useRouter } from 'next/router'
import { getFormatAddress } from '@/utils'

type NFTCardProps = {
  nft: SingleNFTResponse | undefined
  pricePerToken?: bigint
  currency?: string
  buyoutBidAmount?: bigint
  tokenId?: string
  contractAddress?: string
  type?: NFTTypeV2
  creator: string
  soldType: 'listing' | 'auction' | unknown
  viewType?: 'sold' | undefined
}

export function NFTCard(props: NFTCardProps) {
  const {
    nft,
    pricePerToken,
    currency,
    buyoutBidAmount,
    tokenId,
    contractAddress,
    type = 'CFC-721',
    creator,
    soldType,
    viewType,
  } = props

  const router = useRouter()
  const imageUrl = nft?.metadata?.image

  if (!tokenId || !contractAddress || !type) return router.push('/')

  const getSoldTypeTag = () => {
    switch (soldType) {
      case 'listing':
        return <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Direct Sale</span>
      case 'auction':
        return <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">Auction Sale</span>
      default:
        return null
    }
  }

  return (
    <Link
      href={`/nft/${contractAddress}/${type}/${tokenId}`}
      className="relative cursor-pointer w-fit max-w-[320px] h-full rounded-[20px] group overflow-hidden"
    >
      <div className="w-full h-[70%] overflow-hidden rounded-2xl">
        <MediaRenderer
          client={client}
          src={imageUrl}
          className="rounded-2xl group-hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-end flex-col h-[180px] p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground font-semibold text-xl truncate">{nft?.metadata?.name}</h3>

          {viewType === 'sold' ? (
            <div className="flex flex-col gap-1">
              {getSoldTypeTag()}
              <span className="flex items-center gap-1">
                <Icon iconType={'mint-coin'} className="w-4 h-4 flex-shrink-0" />
                <p className="text-foreground/75 text-sm truncate">
                  Sold for: {decimalOffChain(pricePerToken || buyoutBidAmount || 0)}{' '}
                  {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'XFI' : currency}
                </p>
              </span>
              <span className="flex items-center gap-1">
                <Icon iconType={'profile'} className="w-4 h-4 flex-shrink-0" />
                <p className="text-foreground/75 text-sm truncate">
                  Bought by: {getFormatAddress(nft?.ownerAddress!)}
                </p>
              </span>
            </div>
          ) : (
            <>
              {pricePerToken && (
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Icon iconType={'mint-coin'} className="w-4 h-4 flex-shrink-0" />
                    <p className="text-foreground/75 text-sm truncate">
                      Listed Price: {decimalOffChain(pricePerToken)}{' '}
                      {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'XFI' : currency}
                    </p>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon iconType={'profile'} className="w-4 h-4 flex-shrink-0" />
                    <p className="text-foreground/75 text-sm truncate">
                      Listed By: {getFormatAddress(creator)}
                    </p>
                  </span>
                </div>
              )}

              {buyoutBidAmount !== undefined && (
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Icon iconType={'mint-coin'} className="w-4 h-4 flex-shrink-0" />
                    <p className="text-foreground/75 text-sm truncate">
                      Buyout Price: {decimalOffChain(buyoutBidAmount)}{' '}
                      {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'XFI' : currency}
                    </p>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon iconType={'profile'} className="w-4 h-4 flex-shrink-0" />
                    <p className="text-foreground/75 text-sm truncate">
                      Auctioned By: {getFormatAddress(creator)}
                    </p>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
