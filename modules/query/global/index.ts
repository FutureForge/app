import {
  getAllAuctions,
  getAllListing,
  getAllOffers,
  getContractCustom,
} from '@/modules/blockchain'
import { getWinningBid } from '@/modules/blockchain/auction'
import { SingleNFTResponse, StatusType } from '@/utils/lib/types'
import { useQuery } from '@tanstack/react-query'
import { ensureSerializable } from '@/utils'
import axios from 'axios'
import { CROSSFI_API } from '@/utils/configs'
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
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${offer.assetContract}/${offer.tokenId}`,
            { signal: abortController!.signal },
          )
          const nftData = response.data

          let updatedNFT = nftData

          if (
            offer.assetContract.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
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

          if (updatedNFT.metadata === undefined) {
            const contract = getContractCustom({
              contractAddress: nftData.contractAddress,
            })
            const tokenId = nftData.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            return ensureSerializable({
              ...offer,
              soldType: 'listing',
              id: 'listing',
              nft: {
                ...newUpdatedNFTs,
                type: 'CFC-721',
              },
            })
          } else {
            return ensureSerializable({
              ...offer,
              soldType: 'listing',
              id: 'listing',
              nft: {
                ...updatedNFT,
                type: 'CFC-721',
              },
            })
          }
        }),
      )

      const updatedRecentlySoldListing = await Promise.all(
        recentlySoldListing.map(async (listing) => {
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${listing.assetContract}/${listing.tokenId}`,
            { signal: abortController!.signal },
          )
          const nftData = response.data

          let updatedNFT = nftData

          if (
            listing.assetContract.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
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

          if (updatedNFT.metadata === undefined) {
            const contract = getContractCustom({
              contractAddress: nftData.contractAddress,
            })
            const tokenId = nftData.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            return ensureSerializable({
              ...listing,
              soldType: 'listing',
              id: 'listing',
              nft: {
                ...newUpdatedNFTs,
                type: 'CFC-721',
              },
            })
          } else {
            return ensureSerializable({
              ...listing,
              soldType: 'listing',
              id: 'listing',
              nft: {
                ...updatedNFT,
                type: 'CFC-721',
              },
            })
          }
        }),
      )

      const newListingWithNFTs = await Promise.all(
        updatedListing.map(async (listing) => {
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${listing.assetContract}/${listing.tokenId}`,
            { signal: abortController!.signal },
          )
          const nftData = response.data

          let updatedNFT = nftData

          if (
            listing.assetContract.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
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

          if (updatedNFT.metadata === undefined) {
            const contract = getContractCustom({
              contractAddress: nftData.contractAddress,
            })
            const tokenId = nftData.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            return ensureSerializable({
              ...listing,
              id: 'listing',
              nft: {
                ...newUpdatedNFTs,
                type: 'CFC-721',
              },
            })
          } else {
            return ensureSerializable({
              ...listing,
              id: 'listing',
              nft: {
                ...updatedNFT,
                type: 'CFC-721',
              },
            })
          }
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

          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${auction.assetContract}/${auction.tokenId}`,
            { signal: abortController!.signal },
          )
          const nftData = response.data

          let updatedNFT = nftData

          if (
            auction.assetContract.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
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

          if (updatedNFT.metadata === undefined) {
            const contract = getContractCustom({
              contractAddress: nftData.contractAddress,
            })
            const tokenId = nftData.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            return ensureSerializable({
              ...auction,
              soldType: 'auction',
              id: 'auction',
              winningBid: winningBidBody,
              nft: {
                ...newUpdatedNFTs,
                type: 'CFC-721',
              },
            })
          } else {
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
          }
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

          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${auction.assetContract}/${auction.tokenId}`,
            { signal: abortController!.signal },
          )
          const nftData = response.data

          let updatedNFT = nftData

          if (
            auction.assetContract.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
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

          if (updatedNFT.metadata === undefined) {
            const contract = getContractCustom({
              contractAddress: nftData.contractAddress,
            })
            const tokenId = nftData.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            return ensureSerializable({
              ...auction,
              winningBid: winningBidBody,
              nft: {
                ...newUpdatedNFTs,
                id: 'auction',
                type: 'CFC-721',
              },
            })
          } else {
            return ensureSerializable({
              ...auction,
              winningBid: winningBidBody,
              nft: {
                ...updatedNFT,
                id: 'auction',
                type: 'CFC-721',
              },
            })
          }
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
