import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { CROSSFI_API } from '@/utils/configs'
import { UserNFTResponse, StatusType, SingleNFTResponse } from '@/utils/lib/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  getAllOffers,
  getAllListing,
  getAllAuctions,
  getContractCustom,
  getTotalOffers,
  getTotalListings,
  getTotalAuctions,
} from '@/modules/blockchain'
import { ensureSerializable } from '@/utils'
import { getIsAuctionExpired, getWinningBid } from '@/modules/blockchain/auction'
import { includeNFTOwner } from '@/modules/blockchain/lib'
import { getNFT } from 'thirdweb/extensions/erc721'

export function useUserChainInfo() {
  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()

  return { activeAccount, activeWallet }
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userNFTs', 'userProfile', 'profile'],
    queryFn: async () => {
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`,
      )

      const userNFTs = response.data.docs

      const allListings = await getAllListing()

      const userListings = await Promise.all(
        allListings.filter(
          (listing) =>
            listing.listingCreator.toLowerCase() === userAddress?.toLowerCase() &&
            listing.status === StatusType.CREATED,
        ),
      )

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts

          const uniqueTokenIds = Array.from(new Set(tokenIds))

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const response = await axios.get<SingleNFTResponse>(
                `${CROSSFI_API}/token-inventory/${contractAddress}/${ids}`,
              )
              const nft = response.data

              let updatedNFT = nft

              if (
                contractAddress.toLowerCase() ===
                '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
              ) {
                const uri = nft.tokenURI
                const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                }
              }

              const metadata = updatedNFT?.metadata
              if (metadata === undefined) {
                const contract = getContractCustom({
                  contractAddress: updatedNFT?.contractAddress,
                })
                const tokenId = updatedNFT?.tokenId

                const newUpdatedNFTs = await getNFT({
                  contract: contract,
                  tokenId: BigInt(tokenId),
                  includeOwner: includeNFTOwner,
                })

                return { ...nfts, nft: newUpdatedNFTs, type: 'NFTs' }
              } else {
                return { ...nfts, nft: updatedNFT, type: 'NFTs' }
              }
            }),
          )

          return tokenIdNFTs
        }),
      )

      const flatNFTs = updatedNFTs.flat()

      const userNFTsNotListed = flatNFTs.filter((nft: any) => {
        // Check if this NFT is not in the userListings
        const nftTokenId = nft.nft.tokenId || nft?.nft?.id?.toString()
        return !userListings.some(
          (listing) =>
            listing.assetContract.toLowerCase() === nft.contractAddress.toLowerCase() &&
            listing.tokenId.toString() === nftTokenId,
        )
      })

      return ensureSerializable(userNFTsNotListed)
    },
    enabled: !!userAddress && !!activeAccount,
    refetchInterval: 5000,
  })
}

export function useUserOffersMadeQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userOffersMade', 'userProfile', 'profile', 'nfts'],
    queryFn: async () => {
      const totalOffers = await getTotalOffers()

      if (Number(totalOffers) < 0) {
        return []
      } else {
        const allOffers = await getAllOffers()

        const userOffers = allOffers
          .filter(
            (offer) =>
              offer.offeror.toLowerCase() === userAddress?.toLowerCase() &&
              offer.status === StatusType.CREATED,
          )
          .map((offer) => {
            const offersLength = allOffers.filter(
              (offer) =>
                offer.status === StatusType.CREATED &&
                offer.assetContract.toLowerCase() === offer.assetContract.toLowerCase() &&
                offer.tokenId === offer.tokenId,
            ).length

            return { ...offer, type: "Offer's Made", offersCount: offersLength }
          })

        const updatedUserOffers = await Promise.all(
          userOffers.map(async (ids) => {
            const response = await axios.get<SingleNFTResponse>(
              `${CROSSFI_API}/token-inventory/${ids.assetContract}/${ids.tokenId}`,
            )
            const nft = response.data
            let updatedNFT = nft

            if (
              ids.assetContract.toLowerCase() ===
              '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
            ) {
              const uri = nft.tokenURI
              const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            const metadata = updatedNFT?.metadata
            if (metadata === undefined) {
              const contract = getContractCustom({
                contractAddress: updatedNFT?.contractAddress,
              })
              const tokenId = updatedNFT?.tokenId

              const newUpdatedNFTs = await getNFT({
                contract: contract,
                tokenId: BigInt(tokenId),
                includeOwner: includeNFTOwner,
              })
              return { ...ids, nft: newUpdatedNFTs }
            } else {
              return { ...ids, nft: updatedNFT }
            }
          }),
        )

        return ensureSerializable(updatedUserOffers)
      }
    },
    refetchInterval: 5000,
    enabled: !!userAddress,
  })
}

export function useUserListingQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userListing', 'userProfile', 'profile', 'nft'],
    queryFn: async () => {
      const totalListings = await getTotalListings()

      if (Number(totalListings) < 0) {
        return []
      } else {
        const allListings = await getAllListing()
        const allOffers = await getAllOffers()

        const userListings = await Promise.all(
          allListings
            .filter(
              (listing) =>
                listing.listingCreator.toLowerCase() === userAddress?.toLowerCase() &&
                listing.status === StatusType.CREATED,
            )
            .map((listing) => {
              const offersLength = allOffers.filter(
                (offer) =>
                  offer.status === StatusType.CREATED &&
                  offer.assetContract.toLowerCase() === listing.assetContract.toLowerCase() &&
                  offer.tokenId === listing.tokenId,
              ).length

              return { ...listing, type: 'Listed', offersCount: offersLength }
            }),
        )

        const updatedUserListings = await Promise.all(
          userListings.map(async (ids) => {
            const response = await axios.get<SingleNFTResponse>(
              `${CROSSFI_API}/token-inventory/${ids.assetContract}/${ids.tokenId}`,
            )
            const nft = response.data
            let updatedNFT = nft

            if (ids.assetContract.toLowerCase() === '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de') {
              const uri = nft.tokenURI
              const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            const metadata = updatedNFT?.metadata
            if (metadata === undefined) {
              const contract = getContractCustom({
                contractAddress: updatedNFT?.contractAddress,
              })
              const tokenId = updatedNFT?.tokenId

              const newUpdatedNFTs = await getNFT({
                contract: contract,
                tokenId: BigInt(tokenId),
                includeOwner: includeNFTOwner,
              })
              return { ...ids, nft: newUpdatedNFTs }
            } else {
              return { ...ids, nft: updatedNFT }
            }
          }),
        )

        return ensureSerializable(updatedUserListings)
      }
    },
    refetchInterval: 5000,
    enabled: !!userAddress,
  })
}

export function useUserAuctionQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userAuction', 'userProfile', 'profile', 'auction', 'nfts'],
    queryFn: async () => {
      const totalAuctions = await getTotalAuctions()

      if (Number(totalAuctions) === 0) {
        return []
      } else {
        const allAuctions = await getAllAuctions()

        const userAuctions = allAuctions
          .filter(
            (auction) =>
              auction.auctionCreator.toLowerCase() === userAddress?.toLowerCase() &&
              auction.status === StatusType.CREATED,
          )
          .map((auction) => ({ ...auction, type: 'Auction' }))

        const updatedUserAuction = await Promise.all(
          userAuctions.map(async (ids) => {
            const winningBid = await getWinningBid({
              auctionId: BigInt(ids.auctionId),
            })

            const isAuctionActive = await getIsAuctionExpired({
              auctionId: ids.auctionId,
            })

            // Inverting the result to correct the naming mismatch
            const isAuctionExpired = !isAuctionActive

            const winningBidBody = {
              bidder: winningBid[0],
              currency: winningBid[1],
              bidAmount: winningBid[2].toString(), // Convert BigInt to string
            }

            const response = await axios.get<SingleNFTResponse>(
              `${CROSSFI_API}/token-inventory/${ids.assetContract}/${ids.tokenId}`,
            )
            const nft = response.data
            let updatedNFT = nft

            if (
              ids.assetContract.toLowerCase() ===
              '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de'.toLowerCase()
            ) {
              const uri = nft.tokenURI
              const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            const metadata = updatedNFT?.metadata
            if (metadata === undefined) {
              const contract = getContractCustom({
                contractAddress: updatedNFT?.contractAddress,
              })
              const tokenId = updatedNFT?.tokenId

              const newUpdatedNFTs = await getNFT({
                contract: contract,
                tokenId: BigInt(tokenId),
                includeOwner: includeNFTOwner,
              })
              return {
                ...ids,
                nft: newUpdatedNFTs,
                isAuctionExpired,
                winningBid: winningBidBody,
              }
            } else {
              return {
                ...ids,
                nft: updatedNFT,
                isAuctionExpired,
                winningBid: winningBidBody,
              }
            }
          }),
        )

        return ensureSerializable(updatedUserAuction)
      }
    },
    refetchInterval: 5000,
    enabled: !!userAddress,
  })
}
