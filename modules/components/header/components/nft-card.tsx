import React from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'
import { NFT } from '../types/types'
import { Icon } from '@/modules/app'

interface NFTCardProps {
  nft: NFT | undefined
  pricePerToken?: bigint
  currency?: string
  bidAmount?: bigint
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, pricePerToken, currency, bidAmount }) => {
  const imageUrl = nft?.metadata.image

  // Format pricePerToken and bidAmount to Ether (assuming 18 decimals)
  const formattedPrice = pricePerToken ? (Number(pricePerToken) / 10 ** 18).toFixed(2) : undefined
  const formattedBidAmount = bidAmount ? (Number(bidAmount) / 10 ** 18).toFixed(2) : '0.00'

  return (
    <div className="relative w-fit max-w-[320px] h-[320px] rounded-3xl">
      <MediaRenderer client={client} src={imageUrl} className="w-full h-full rounded-2xl" />
      <div className="absolute bottom-0 left-0 w-full flex justify-end flex-col h-[160px] p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
        <div className='flex flex-col gap-2'>
          <h3 className="text-foreground font-semibold text-2xl">{nft?.metadata.name}</h3>

          {formattedPrice && (
            <span className="flex items-center gap-1">
              <Icon iconType={'mint-coin'} />
              <p className="text-foreground tex-sm">
                Floor Price: {formattedPrice}{' '}
                {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'ETH' : currency}
              </p>
            </span>
          )}

          {bidAmount !== undefined && (
            <span className="flex items-center gap-1">
              <Icon iconType={'mint-coin'} />
              <p className="text-foreground text-sm">
                Winning Bid: {formattedBidAmount}{' '}
                {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'ETH' : currency}
              </p>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTCard
