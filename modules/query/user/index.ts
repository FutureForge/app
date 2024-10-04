import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { CROSSFI_API, CROSSFI_MINTER_ADDRESS } from '@/utils/configs'
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
import { ensureSerializable, tryParseJSON } from '@/utils'
import { getIsAuctionExpired, getWinningBid } from '@/modules/blockchain/auction'
import { includeNFTOwner } from '@/modules/blockchain/lib'
import { getNFT } from 'thirdweb/extensions/erc721'
import { useAbortController } from '..'

export function useUserChainInfo() {
  const activeAccount = useActiveAccount()
  const activeWallet = useActiveWallet()

  return { activeAccount, activeWallet }
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address
  const abortController = useAbortController()

  return useQuery({
    queryKey: ['userNFTs', 'userProfile', 'profile'],
    queryFn: async () => {
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`,
        { signal: abortController!.signal },
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
              const contract = getContractCustom({
                contractAddress: contractAddress,
              })

              const nft = await getNFT({
                contract: contract,
                tokenId: BigInt(ids),
                includeOwner: includeNFTOwner,
              })

              let updatedNFT = nft

              const uri = nft.tokenURI
              const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

              if (parsedMetadata && typeof parsedMetadata === 'object') {
                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                }
              }

              return { ...nfts, nft: updatedNFT, type: 'NFTs' }
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
  const abortController = useAbortController()

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
              (o) =>
                o.status === StatusType.CREATED &&
                o.assetContract.toLowerCase() === offer.assetContract.toLowerCase() &&
                o.tokenId === offer.tokenId,
            ).length

            return { ...offer, type: "Offer's Made", offersCount: offersLength }
          })

        const updatedUserOffers = await Promise.all(
          userOffers.map(async (ids) => {
            const contract = getContractCustom({
              contractAddress: ids?.assetContract,
            })
            const tokenId = ids?.tokenId

            const nft = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })
            let updatedNFT = nft

            const uri = nft.tokenURI
            const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

            if (parsedMetadata && typeof parsedMetadata === 'object') {
              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            return { ...ids, nft: updatedNFT }
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
  const abortController = useAbortController()

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
            const contract = getContractCustom({
              contractAddress: ids?.assetContract,
            })
            const tokenId = ids?.tokenId

            const nft = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })
            let updatedNFT = nft

            const uri = nft.tokenURI
            const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

            if (parsedMetadata && typeof parsedMetadata === 'object') {
              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            return { ...ids, nft: updatedNFT }
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
  const abortController = useAbortController()

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

            const contract = getContractCustom({
              contractAddress: ids?.assetContract,
            })
            const tokenId = ids?.tokenId

            const nft = await getNFT({
              contract: contract,
              tokenId: BigInt(tokenId),
              includeOwner: includeNFTOwner,
            })
            let updatedNFT = nft

            const uri = nft.tokenURI
            const parsedMetadata = typeof uri === 'string' ? tryParseJSON(uri) : uri

            if (parsedMetadata && typeof parsedMetadata === 'object') {
              updatedNFT = {
                ...nft,
                tokenURI: parsedMetadata.image,
                metadata: {
                  ...parsedMetadata,
                },
              }
            }

            return {
              ...ids,
              nft: updatedNFT,
              isAuctionExpired,
              winningBid: winningBidBody,
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
