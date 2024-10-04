import {
  getAllAuctions,
  getAllListing,
  getAllOffers,
  getContractCustom,
} from '@/modules/blockchain'
import { getWinningBid } from '@/modules/blockchain/auction'
import { StatusType } from '@/utils/lib/types'
import { useQuery } from '@tanstack/react-query'
import { ensureSerializable, tryParseJSON } from '@/utils'
import { getNFT } from 'thirdweb/extensions/erc721'
import { includeNFTOwner } from '@/modules/blockchain/lib'
import { useAbortController } from '..'

export function useGetGlobalListingOrAuctionQuery() {
  const abortController = useAbortController()

  return useQuery({
    queryKey: ['global-query'],
    queryFn: async () => {
      const [allAuctions, allListing] = await Promise.all([getAllAuctions(), getAllListing()])
      const [allOffers] = await Promise.all([getAllOffers()])

      const createdAuction = allAuctions
        .filter((auction) => auction.status === StatusType.CREATED)
        .reverse()
        .slice(0, 20)

      const updatedListing = allListing
        .filter((listing) => listing.status === StatusType.CREATED)
        .reverse()
        .slice(0, 20)

      const recentlySoldAuction = allAuctions
        .filter((auction) => auction.status === StatusType.COMPLETED)
        .reverse()
        .slice(0, 20)

      const recentlySoldListing = allListing
        .filter((listing) => listing.status === StatusType.COMPLETED)
        .reverse()
        .slice(0, 20)

      const recentlySoldOffers = allOffers
        .filter((offer) => offer.status === StatusType.COMPLETED)
        .reverse()
        .slice(0, 20)

      const updatedRecentlySoldOffers = await Promise.all(
        recentlySoldOffers.map(async (offer) => {
          const contract = getContractCustom({
            contractAddress: offer.assetContract,
          })
          const tokenId = offer.tokenId

          const nftData = await getNFT({
            contract: contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          })

          let updatedNFT = nftData

          const uri = nftData.tokenURI
          const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

          if (parsedMetadata && typeof parsedMetadata === 'object') {
            updatedNFT = {
              ...nftData,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          }

          return ensureSerializable({
            ...offer,
            soldType: 'listing',
            id: 'listing',
            nft: {
              ...updatedNFT,
              type: 'CFC-721',
            },
          })
        }),
      )

      const updatedRecentlySoldListing = await Promise.all(
        recentlySoldListing.map(async (listing) => {
          const contract = getContractCustom({
            contractAddress: listing.assetContract,
          })
          const tokenId = listing.tokenId

          const nftData = await getNFT({
            contract: contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          })

          let updatedNFT = nftData

          const uri = nftData.tokenURI
          const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

          if (parsedMetadata && typeof parsedMetadata === 'object') {
            updatedNFT = {
              ...nftData,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          }

          return ensureSerializable({
            ...listing,
            soldType: 'listing',
            id: 'listing',
            nft: {
              ...updatedNFT,
              type: 'CFC-721',
            },
          })
        }),
      )

      const newListingWithNFTs = await Promise.all(
        updatedListing.map(async (listing) => {
          const contract = getContractCustom({
            contractAddress: listing.assetContract,
          })
          const tokenId = listing.tokenId

          const nftData = await getNFT({
            contract: contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          })

          let updatedNFT = nftData

          const uri = nftData.tokenURI
          const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

          if (parsedMetadata && typeof parsedMetadata === 'object') {
            updatedNFT = {
              ...nftData,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          }

          return ensureSerializable({
            ...listing,
            id: 'listing',
            nft: {
              ...updatedNFT,
              type: 'CFC-721',
            },
          })
        }),
      )

      const updatedRecentlySoldAuction = await Promise.all(
        recentlySoldAuction.map(async (auction) => {
          const winningBid = await getWinningBid({
            auctionId: auction.auctionId,
          })

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2],
          }

          const contract = getContractCustom({
            contractAddress: auction.assetContract,
          })
          const tokenId = auction.tokenId

          const nftData = await getNFT({
            contract: contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          })

          let updatedNFT = nftData

          const uri = nftData.tokenURI
          const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

          if (parsedMetadata && typeof parsedMetadata === 'object') {
            const uri = nftData.tokenURI
            const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

            updatedNFT = {
              ...nftData,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          }

          return ensureSerializable({
            ...auction,
            soldType: 'auction',
            id: 'auction',
            winningBid: winningBidBody,
            nft: {
              ...updatedNFT,
              type: 'CFC-721',
            },
          })
        }),
      )

      const updatedAuction = await Promise.all(
        createdAuction.map(async (auction) => {
          const winningBid = await getWinningBid({
            auctionId: auction.auctionId,
          })

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2],
          }

          const contract = getContractCustom({
            contractAddress: auction.assetContract,
          })
          const tokenId = auction.tokenId

          const nftData = await getNFT({
            contract: contract,
            tokenId: BigInt(tokenId),
            includeOwner: includeNFTOwner,
          })

          let updatedNFT = nftData

          const uri = nftData.tokenURI
          const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

          if (parsedMetadata && typeof parsedMetadata === 'object') {
            updatedNFT = {
              ...nftData,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          }

          return ensureSerializable({
            ...auction,
            winningBid: winningBidBody,
            nft: {
              ...updatedNFT,
              id: 'auction',
              type: 'CFC-721',
            },
          })
        }),
      )

      return ensureSerializable({
        allAuction: updatedAuction,
        allListing: newListingWithNFTs,
        recentlySoldListing: [...updatedRecentlySoldListing, ...updatedRecentlySoldOffers],
        recentlySoldAuction: updatedRecentlySoldAuction,
      })
    },
    enabled: true,
    refetchInterval: 5000,
  })
}
