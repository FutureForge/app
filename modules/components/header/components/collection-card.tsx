import { Icon } from '@/modules/app'
import { client } from '@/utils/configs'
import { NFTType } from '@/utils/lib/types'
import Link from 'next/link'
import { NFT } from 'thirdweb'
import { MediaRenderer } from 'thirdweb/react'

type Collection = {
  _id: string
  collectionContractAddress?: string
  name: string
  description?: string
  nftType?: NFTType
  image?: string
}

export type CollectionData = {
  collection?: Collection
  nfts?: NFT
  totalVolume?: number
  floorPrice?: string
}

export function CollectionCard({ collection, floorPrice, totalVolume }: CollectionData) {
  if (!collection) {
    return null
  }
  const { collectionContractAddress, image, name } = collection

  const href = `/collections/${collectionContractAddress}`

  return (
    <Link
      href={href}
      className="relative cursor-pointer w-full max-w-[280px] h-full !max-h-[300px] !min-h-[300px] rounded-[20px] group overflow-hidden"
    >
      <div className="w-full h-full overflow-hidden rounded-2xl">
        <MediaRenderer
          client={client}
          src={image}
          className="rounded-2xl w-full h-full group-hover:scale-105 transition duration-300 ease-in-out"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-end flex-col h-[180px] p-4 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
        <h3 className="text-foreground font-semibold text-xl truncate">{name}</h3>
        <span className="flex items-center gap-1">
          <Icon iconType={'mint-coin'} className="w-4 h-4 flex-shrink-0" />
          <p className="text-foreground/75 text-sm truncate">Floor Price: {floorPrice} XFI</p>
        </span>
        <span className="flex items-center gap-1">
          <Icon iconType={'coins'} className="w-4 h-4 flex-shrink-0" />
          <p className="text-foreground/75 text-sm truncate">Total Volume: {totalVolume} XFI</p>
        </span>
      </div>
    </Link>
  )
}
