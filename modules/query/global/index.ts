import { getAllAuctions, getAllListing, getContractCustom } from '@/modules/blockchain'
import { getWinningBid } from '@/modules/blockchain/auction'
import { SingleNFTResponse, StatusType, TokenType } from '@/utils/lib/types'
import { useQuery } from '@tanstack/react-query'
import { ensureSerializable } from '@/utils'
import axios from 'axios'
import { CROSSFI_API } from '@/utils/configs'

export function useGetGlobalListingOrAuctionQuery() {
  return useQuery({
    queryKey: ['global-query'],
    queryFn: async () => {
      const [allAuctions, allListing] = await Promise.all([getAllAuctions(), getAllListing()])

      const createdAuction = allAuctions.filter((auction) => auction.status === StatusType.CREATED)
      const updatedListing = allListing.filter((listing) => listing.status === StatusType.CREATED)

      const recentlySoldAuction = allAuctions.filter(
        (auction) => auction.status === StatusType.COMPLETED,
      )
      const recentlySoldListing = allListing.filter(
        (listing) => listing.status === StatusType.COMPLETED,
      )

      const updatedRecentlySoldListing = await Promise.all(
        recentlySoldListing.map(async (listing) => {
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${listing.assetContract}/${listing.tokenId}`,
          )
          const nftData = response.data

          return ensureSerializable({
            ...listing,
            soldType: 'listing',
            nft: {
              ...nftData,
              type: 'CFC-721',
            },
          })
        }),
      )

      const newListingWithNFTs = await Promise.all(
        updatedListing.map(async (listing) => {
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${listing.assetContract}/${listing.tokenId}`,
          )
          const nftData = response.data

          return ensureSerializable({
            ...listing,
            nft: {
              ...nftData,
              type: 'CFC-721',
            },
          })
        }),
      )

      const updatedRecentlySoldAuction = await Promise.all(
        recentlySoldAuction.map(async (auction) => {
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

          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${auction.assetContract}/${auction.tokenId}`,
          )
          const nftData = response.data

          return ensureSerializable({
            ...auction,
            soldType: 'auction',
            winningBid: winningBidBody,
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

          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${auction.assetContract}/${auction.tokenId}`,
          )
          const nftData = response.data

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
        recentlySold: [...updatedRecentlySoldListing, ...updatedRecentlySoldAuction],
      })
    },
    enabled: true,
    refetchInterval: 5000,
  })
}
