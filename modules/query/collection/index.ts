import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { decimals } from 'thirdweb/extensions/erc20'
import { getAllAuctions, getAllListing, getAllOffers } from '@/modules/blockchain'
import { ICollection } from '@/utils/models'
import {
  CollectionNFTResponse,
  NFTActivity,
  NFTActivityResponse,
  NFTTypeV2,
  SingleNFTResponse,
  StatusType,
} from '@/utils/lib/types'
import { ethers } from 'ethers'
import { decimalOffChain, getContractCustom, includeNFTOwner } from '@/modules/blockchain/lib'
import { getIsAuctionExpired, getWinningBid } from '@/modules/blockchain/auction'
import { CROSSFI_API } from '@/utils/configs'
import { ensureSerializable } from '@/utils'
import { useUserChainInfo } from '../user'
import { getNFT } from 'thirdweb/extensions/erc721'
import { NFT } from 'thirdweb'

export function useFetchCollectionsQuery() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await axios.get('/api/collection')
      return response.data.data
    },
    initialData: [],
    refetchInterval: 5000,
  })
}

export function useCheckIfItsACollectionQuery(collectionAddress: string) {
  return useQuery({
    queryKey: ['add-collection', collectionAddress],
    queryFn: async () => {
      const response = await axios.get(
        `${CROSSFI_API}/contracts?contractAddress=${collectionAddress}&page=1&limit=10&sort=-blockNumber`,
      )
      const nftData = response.data.docs

      const isCFC721 = nftData.some((doc: { tokenType: string }) => doc.tokenType === 'CFC-721')

      return { isCFC721, nftData }
    },
    enabled: !!collectionAddress,
    refetchInterval: 5000,
  })
}

export function useGetMarketplaceCollectionsQuery() {
  const { data: collections } = useFetchCollectionsQuery()

  return useQuery({
    queryKey: ['collections', 'marketplace', collections],
    queryFn: async () => {
      if (!collections || collections.length === 0) return []

      const collectionPromises = collections.map(async (collection: ICollection) => {
        try {
          const response = await axios.get<CollectionNFTResponse>(
            `${CROSSFI_API}/token-inventory?contractAddress=${collection.collectionContractAddress}&page=1&limit=20000&sort=-blockNumber`,
          )

          const nfts = response.data.docs

          const updatedNFTs = await Promise.all(
            nfts.map(async (nft) => {
              const metadata = nft?.metadata
              if (
                collection.collectionContractAddress.toLowerCase() ===
                '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
              ) {
                const uri = nft.tokenURI
                const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

                return {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                }
              } else if (metadata === undefined || null) {
                const contract = getContractCustom({
                  contractAddress: nft.contractAddress,
                })
                const tokenId = nft.tokenId

                const newUpdatedNFTs = await getNFT({
                  contract: contract,
                  tokenId: BigInt(tokenId),
                  includeOwner: includeNFTOwner,
                })

                return {
                  ...nft,
                  ...newUpdatedNFTs,
                }
              } else {
                return nft
              }
            }),
          )

          const allListing = await getAllListing()

          const collectionListing = allListing.filter(
            (listing) =>
              listing.assetContract.toLowerCase() ===
                collection.collectionContractAddress.toLowerCase() &&
              listing.status === StatusType.CREATED,
          )

          const totalVolumeCollection = allListing.filter(
            (listing) =>
              listing.assetContract.toLowerCase() ===
                collection.collectionContractAddress.toLowerCase() &&
              listing.status === StatusType.COMPLETED,
          )

          const totalVolume = totalVolumeCollection.reduce((acc, listing) => {
            const price = parseFloat(decimalOffChain(listing.pricePerToken) || '0')
            return acc + price
          }, 0)

          const formattedPrices = await Promise.all(
            collectionListing.map(async (listing) => {
              if (listing.currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
                return ethers.utils.formatUnits(listing.pricePerToken, 'ether')
              } else {
                const tokenContract = await getContractCustom({
                  contractAddress: listing.currency,
                })
                const tokenDecimals = await decimals({
                  contract: tokenContract,
                })
                return ethers.utils.formatUnits(listing.pricePerToken, tokenDecimals)
              }
            }),
          )

          const floorPrice =
            formattedPrices.length > 0
              ? Math.min(...formattedPrices.map((price) => parseFloat(price)))
              : 0

          return {
            collection,
            nfts: updatedNFTs,
            totalVolume,
            floorPrice: floorPrice.toString(),
          }
        } catch (error) {
          return null
        }
      })

      const settledResults = await Promise.allSettled(collectionPromises)
      const collectionsData = settledResults
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((value) => value !== null)

      return ensureSerializable(collectionsData)
    },
    enabled: !!collections,
    refetchInterval: 6000,
  })
}

export function useGetSingleNFTQuery({
  contractAddress,
  nftType,
  tokenId,
}: {
  contractAddress: string
  nftType: NFTTypeV2
  tokenId: string
}) {
  const { activeAccount } = useUserChainInfo()

  return useQuery({
    queryKey: ['nft', contractAddress, nftType, tokenId, activeAccount?.address],
    queryFn: async () => {
      try {
        // get nft activity
        let nftActivity: NFTActivity[] = []
        try {
          const response = await axios.get<NFTActivityResponse>(
            `${CROSSFI_API}/token-transfers?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=${nftType}&page=1&limit=100&sort=-blockNumber`,
          )
          nftActivity = response.data.docs
        } catch (error) {
          nftActivity = []
        }

        let nftList: SingleNFTResponse | NFT | null = null

        if (nftType === 'CFC-721') {
          const response = await axios.get<SingleNFTResponse>(
            `${CROSSFI_API}/token-inventory/${contractAddress}/${tokenId}`,
          )
          const nft = response.data

          const metadata = nft?.metadata
          if (
            contractAddress.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
            const uri = nft.tokenURI
            const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

            nftList = {
              ...nft,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          } else if (metadata === undefined || null) {
            const contract = getContractCustom({
              contractAddress: nft.contractAddress,
            })
            const tokenId = nft.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            nftList = { ...nft, ...newUpdatedNFTs }
          } else {
            nftList = nft
          }
        } else {
          throw new Error('NFT type not supported')
        }

        const allAuctions = await getAllAuctions()
        const allListing = await getAllListing()

        const nftAuctionList = allAuctions.find(
          (auction) =>
            auction.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
            auction.tokenId === BigInt(tokenId) &&
            auction.status === StatusType.CREATED,
        )

        const nftListingList = allListing.find(
          (listing) =>
            listing.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
            listing.tokenId === BigInt(tokenId) &&
            listing.status === StatusType.CREATED,
        )

        let result: any = {}

        if (nftAuctionList) {
          const winningBid = await getWinningBid({
            auctionId: nftAuctionList.auctionId,
          })

          const isAuctionActive = await getIsAuctionExpired({
            auctionId: nftAuctionList.auctionId,
          })

          // Inverting the result to correct the naming mismatch
          const isAuctionExpired = !isAuctionActive

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2].toString(), // Convert BigInt to string
          }

          result = {
            id: 'auction',
            nft: nftList,
            nftAuctionList,
            isAuctionExpired,
            winningBid: winningBidBody,
            nftActivity,
          }
        } else if (nftListingList) {
          const allOffers = await getAllOffers()
          const filteredOffers = allOffers.filter(
            (offers) =>
              offers.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
              offers.tokenId === BigInt(tokenId) &&
              offers.status === StatusType.CREATED,
          )

          result = {
            id: 'listing',
            nftListingList,
            nft: nftList,
            offers:
              filteredOffers.map((offer) => ({
                ...offer,
                tokenId: offer.tokenId.toString(),
              })) || [],
            nftActivity,
          }
        } else {
          const allOffers = await getAllOffers()
          const filteredOffers = allOffers.filter(
            (offers) =>
              offers.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
              offers.tokenId === BigInt(tokenId) &&
              offers.status === StatusType.CREATED,
          )

          result = {
            id: 'none',
            nft: nftList,
            message: 'No auction or listing found for the given token ID.',
            offers:
              filteredOffers.map((offer) => ({
                ...offer,
                tokenId: offer.tokenId.toString(),
              })) || [],
            nftActivity,
          }
        }

        return ensureSerializable(result)
      } catch (error: any) {
        throw new Error(`Failed to fetch NFT data: ${error.message}`)
      }
    },
    enabled: !!contractAddress && !!nftType && !!tokenId,
    refetchInterval: 5000,
  })
}

export function useGetSingleCollectionQuery({ contractAddress }: { contractAddress: string }) {
  const { data: collections } = useFetchCollectionsQuery()

  return useQuery({
    queryKey: ['collection', 'auction', contractAddress],
    queryFn: async () => {
      const [allListing, allOffers, allAuctions] = await Promise.all([
        getAllListing(),
        getAllOffers(),
        getAllAuctions(),
      ])

      const currentCollection = await collections.find(
        (collection: ICollection) =>
          collection.collectionContractAddress.toLowerCase() === contractAddress.toLowerCase(),
      )

      const tokenResponse = await axios.get(`${CROSSFI_API}/tokens/${contractAddress}`)
      const tokenDetails = tokenResponse.data

      const response = await axios.get<CollectionNFTResponse>(
        `${CROSSFI_API}/token-inventory?contractAddress=${contractAddress}&page=1&limit=20000&sort=-blockNumber`,
      )
      const nfts = response.data.docs

      const tokenTransfersResponse = await axios.get<NFTActivityResponse>(
        `${CROSSFI_API}/token-transfers?contractAddress=${contractAddress}&tokenType=CFC-721&page=1&limit=20000&sort=-blockNumber`,
      )
      const tokenTransfers = tokenTransfersResponse.data.docs

      const collectionCompletedListing = allListing.filter(
        (listing) =>
          listing.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
          listing.status === StatusType.COMPLETED,
      )

      const collectionListing = allListing.filter(
        (listing) =>
          listing.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
          listing.status === StatusType.CREATED,
      )

      const collectionAuction = allAuctions.filter(
        (auction) =>
          auction.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
          auction.status === StatusType.CREATED,
      )

      const collectionCompletedAuction = allAuctions.filter(
        (auction) =>
          auction.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
          auction.status === StatusType.COMPLETED,
      )

      const totalVolumeCollection = allListing.filter(
        (listing) => listing.status === StatusType.COMPLETED,
      )

      const totalVolume = totalVolumeCollection.reduce((acc, listing) => {
        const price = parseFloat(decimalOffChain(listing.pricePerToken) || '0')
        return acc + price
      }, 0)

      const collectionOffers = allOffers.filter(
        (offer) =>
          offer.assetContract.toLowerCase() === contractAddress.toLowerCase() &&
          offer.status === StatusType.CREATED,
      )

      const listingMap = new Map<string, any>()
      collectionListing.forEach((listing) => {
        listingMap.set(listing.tokenId.toString(), listing)
      })

      const auctionMap = new Map<string, any>()
      collectionAuction.forEach((auction) => {
        auctionMap.set(auction.tokenId.toString(), auction)
      })

      const updatedNFTs = await Promise.all(
        nfts.map(async (nft) => {
          let nftList: SingleNFTResponse | NFT | null = null
          const listing = listingMap.get(nft.tokenId.toString())
          const auction = auctionMap.get(nft.tokenId.toString())
          const metadata = nft?.metadata

          if (
            contractAddress.toLowerCase() ===
            '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
          ) {
            const uri = nft.tokenURI
            const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

            nftList = {
              ...nft,
              tokenURI: parsedMetadata.image,
              metadata: {
                ...parsedMetadata,
              },
            }
          } else if (metadata === undefined || null) {
            const contract = getContractCustom({
              contractAddress: nft.contractAddress,
            })
            const tokenId = nft.tokenId

            const newUpdatedNFTs = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })

            nftList = { ...nft, ...newUpdatedNFTs }
          } else {
            nftList = nft
          }

          return {
            ...nftList,
            listing: listing || null,
            auction: auction || null,
          }
        }),
      )

      const updatedCollectionSalesNFT = await Promise.all(
        collectionCompletedListing.map(async (sale) => {
          // @ts-ignore
          const nft = updatedNFTs.find((nft) => nft.tokenId === sale.tokenId.toString())
          return {
            ...sale,
            nft,
            soldType: 'listing',
          }
        }),
      )

      const updatedCollectionAuctionNFT = await Promise.all(
        collectionCompletedAuction.map(async (sale) => {
          const winningBid = await getWinningBid({
            auctionId: sale.auctionId,
          })

          // @ts-ignore
          const nft = updatedNFTs.find((nft) => nft.tokenId === sale.tokenId.toString())

          const winningBidBody = {
            bidder: winningBid[0],
            currency: winningBid[1],
            bidAmount: winningBid[2],
          }

          return {
            ...sale,
            nft,
            soldType: 'auction',
            winningBid: winningBidBody,
          }
        }),
      )

      const updatedCollectionOffers = await Promise.all(
        collectionOffers.map(async (offer) => {
          // @ts-ignore
          const nft = updatedNFTs.find((nft) => nft.tokenId === offer.tokenId.toString())
          return {
            ...offer,
            nft,
          }
        }),
      )

      const updatedTokenTransfers = await Promise.all(
        tokenTransfers.map(async (transfer) => {
          // @ts-ignore
          const nft = updatedNFTs.find((nft) => nft.tokenId === transfer.tokenId.toString())
          return {
            ...transfer,
            nft,
          }
        }),
      )

      // Calculate formatted prices and floor price
      let totalFormattedPrice = ethers.BigNumber.from(0)
      for (const listing of collectionListing) {
        let formattedPrice: string

        if (listing.currency === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
          formattedPrice = ethers.utils.formatUnits(listing.pricePerToken, 'ether')
        } else {
          const tokenContract = await getContractCustom({
            contractAddress: listing.currency,
          })
          const tokenDecimals = await decimals({ contract: tokenContract })

          formattedPrice = ethers.utils.formatUnits(listing.pricePerToken, tokenDecimals)
        }

        totalFormattedPrice = totalFormattedPrice.add(ethers.utils.parseUnits(formattedPrice, 18))
      }

      const collectionLength = updatedNFTs.length
      const listedNFTs = updatedNFTs.filter((nft) => nft.listing !== null).length
      const percentageOfListed = (listedNFTs / collectionLength) * 100

      const floorPrice =
        collectionLength > 0
          ? ethers.utils.formatUnits(totalFormattedPrice.div(collectionLength), 'ether')
          : '0'

      return ensureSerializable({
        nfts: updatedNFTs,
        collection: currentCollection,
        collectionOffers: updatedCollectionOffers,
        totalVolume,
        floorPrice,
        listedNFTs,
        percentageOfListed,
        tokenDetails,
        tokenTransfers: updatedTokenTransfers,
        sales: [...updatedCollectionSalesNFT, ...updatedCollectionAuctionNFT],
      })
    },
    initialData: {
      nfts: [],
      collection: {},
      collectionOffers: [],
      totalVolume: 0,
      floorPrice: '0',
      listedNFTs: 0,
      percentageOfListed: 0,
      tokenDetails: {},
      tokenTransfers: [],
      sales: [],
    },
    enabled: !!collections && !!contractAddress,
    refetchInterval: 5000,
  })
}
