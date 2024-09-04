 // Assuming you have this hook set up
import { useRouter } from 'next/router'
import { decimalOffChain } from '@/modules/blockchain'
import { NFTType } from '@/utils/lib/types'
import { useGetSingleNFTQuery } from '@/modules/query'

const NFTDetailPage = () => {
  const router = useRouter()
  const { contractAddress, nftType, tokenId } = router.query

  const {
    data: nft,
    isLoading,
    isError,
  } = useGetSingleNFTQuery({
    contractAddress: contractAddress as string,
    nftType: nftType as NFTType,
    tokenId: tokenId as string,
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading NFT details.</p>

  return (
    <div className="container mx-auto p-4 md:px-14 px-4">
      details here
    </div>
  )
}

export default NFTDetailPage
