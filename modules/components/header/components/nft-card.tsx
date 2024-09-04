import React from 'react'
import { MediaRenderer } from 'thirdweb/react'
import { client } from '@/utils/configs'
import { Icon } from '@/modules/app'
import { decimalOffChain } from '@/modules/blockchain'
import { NFT } from 'thirdweb'
import Link from 'next/link'
import { NFTType } from '@/utils/lib/types'
import { useRouter } from 'next/router'

type NFTCardProps = {
  nft: NFT | undefined
  pricePerToken?: bigint
  currency?: string
  buyoutBidAmount?: bigint
  tokenId?: string
  contractAddress?: string
  type?: NFTType
}

export function NFTCard(props: NFTCardProps) {
  const { nft, pricePerToken, currency, buyoutBidAmount, tokenId, contractAddress, type } = props
  const router = useRouter()

  const imageUrl = nft?.metadata.image

  // Handle missing parameters or type
  if (!tokenId || !contractAddress || !type) return null
  const slug = [contractAddress, type, tokenId].join('/')

  return (
    <Link
      href={`/nft/${contractAddress}/${type}/${tokenId}`}
      className="relative cursor-pointer w-fit max-w-[320px] h-[320px] rounded-[20px] group overflow-hidden"
    >
      <MediaRenderer
        client={client}
        src={imageUrl}
        className="w-full h-full rounded-2xl group-hover:scale-105 transition duration-300 ease-in-out"
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-end flex-col h-[160px] p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground font-semibold text-2xl">{nft?.metadata.name}</h3>

          {pricePerToken && (
            <span className="flex items-center gap-1">
              <Icon iconType={'mint-coin'} />
              <p className="text-foreground/75 text-sm">
                Listed Price: {decimalOffChain(pricePerToken)}{' '}
                {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'XFI' : currency}
              </p>
            </span>
          )}

          {buyoutBidAmount !== undefined && (
            <span className="flex items-center gap-1">
              <Icon iconType={'mint-coin'} />
              <p className="text-foreground/75 text-sm">
                Buyout Price: {decimalOffChain(buyoutBidAmount)}{' '}
                {currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'XFI' : currency}
              </p>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
