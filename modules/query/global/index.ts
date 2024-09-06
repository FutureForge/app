import { getAllAuctions, getAllListing, getContractCustom } from '@/modules/blockchain'
import { getWinningBid } from '@/modules/blockchain/auction'
import { decimalOffChain, includeNFTOwner } from '@/modules/blockchain/lib'
import { StatusType, TokenType } from '@/utils/lib/types'
import { useQuery } from '@tanstack/react-query'
import { NFT } from 'thirdweb'
import { getNFT as getERC721NFT } from 'thirdweb/extensions/erc721'
import { getNFT as getERC1155NFT } from 'thirdweb/extensions/erc1155'
import { ensureSerializable } from '@/utils'

export function useGetGlobalListingOrAuctionQuery() {
  return useQuery({
    queryKey: ['global-query'],
    queryFn: async () => {
      const [allAuctions, allListing] = await Promise.all([getAllAuctions(), getAllListing()])

      const createdAuction = allAuctions.filter((auction) => auction.status === StatusType.CREATED)
      const updatedListing = allListing.filter((listing) => listing.status === StatusType.CREATED)

      const newListingWithNFTs = await Promise.all(
        updatedListing.map(async (listing) => {
          const contract = await getContractCustom({
            contractAddress: listing.assetContract,
          })

          let nftData: NFT | undefined = undefined

          if (listing.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(listing.tokenId),
              includeOwner: includeNFTOwner,
            })
          } else if (listing.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(listing.tokenId),
            })
          }

          return ensureSerializable({
            ...listing,
            nft: {
              ...nftData,
              type: 'CFC-721',
            },
          })
        }),
      )

      const updatedAuction = await Promise.all(
        createdAuction.map(async (auction) => {
          const contract = await getContractCustom({
            contractAddress: auction.assetContract,
          })

          const winningBid = await getWinningBid({
            auctionId: auction.auctionId,
          })

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2],
          }

          let nftData: NFT | undefined = undefined

          if (auction.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(auction.tokenId),
              includeOwner: includeNFTOwner,
            })
          } else if (auction.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(auction.tokenId),
            })
          }

          return ensureSerializable({
            ...auction,
            winningBid: winningBidBody,
            nft: {
              ...nftData,
              type: 'CFC-721',
            },
          })
        }),
      )

      return ensureSerializable({
        allAuction: updatedAuction,
        allListing: newListingWithNFTs,
      })
    },
    enabled: true,
    refetchInterval: 5000,
  })
}
