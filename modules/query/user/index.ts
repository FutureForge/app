import { getNFT as getCFC721NFT } from 'thirdweb/extensions/erc721'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { CROSSFI_API, TEST_WALLET_ADDRESS } from '@/utils/configs'
import { NFTResponse, StatusType } from '@/utils/lib/types'
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
      const response = await axios.get<NFTResponse>(
        `${CROSSFI_API}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`,
      )

      const userNFTs = response.data.docs

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts

          const uniqueTokenIds = Array.from(new Set(tokenIds))

          const contract = await getContractCustom({
            contractAddress,
          })

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const nft = await getCFC721NFT({ contract, tokenId: BigInt(ids) })
              let updatedNFT = nft

              if (contractAddress === '0x6af8860ba9eed41c3a3c69249da5ef8ac36d20de') {
                const { uri } = nft.metadata
                const parsedMetadata = typeof uri === 'string' ? JSON.parse(uri) : uri

                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                }
              }

              return { ...nfts, nft: updatedNFT }
            }),
          )

          return tokenIdNFTs
        }),
      )

      const flatNFTs = updatedNFTs.flat()

      return ensureSerializable(flatNFTs)
    },
    enabled: !!userAddress,
  })
}

export function useUserOffersMadeQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userOffersMade', 'userProfile', 'profile'],
    queryFn: async () => {
      const totalOffers = await getTotalOffers()

      if (Number(totalOffers) === 0) {
        return []
      } else {
        const allOffers = await getAllOffers()

        const userOffers = allOffers.filter(
          (offer) => offer.offeror === userAddress && offer.status === StatusType.CREATED,
        )

        return ensureSerializable(userOffers)
      }
    },
    refetchInterval: 6000,
    enabled: !!userAddress,
  })
}

export function useUserListingQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userListing', 'userProfile', 'profile'],
    queryFn: async () => {
      const totalListings = await getTotalListings()

      if (Number(totalListings) === 0) {
        return []
      } else {
        const allListings = await getAllListing()

        const userListings = allListings.filter(
          (listing) =>
            listing.listingCreator === userAddress && listing.status === StatusType.CREATED,
        )

        return ensureSerializable(userListings)
      }
    },
    refetchInterval: 6000,
    enabled: !!userAddress,
  })
}

export function useUserAuctionQuery() {
  const { activeAccount } = useUserChainInfo()
  const userAddress = activeAccount?.address

  return useQuery({
    queryKey: ['userAuction', 'userProfile', 'profile', 'auction'],
    queryFn: async () => {
      const totalAuctions = await getTotalAuctions()

      if (Number(totalAuctions) === 0) {
        return []
      } else {
        const allAuctions = await getAllAuctions()

        const userAuctions = allAuctions.filter(
          (auction) =>
            auction.auctionCreator === userAddress && auction.status === StatusType.CREATED,
        )

        return ensureSerializable(userAuctions)
      }
    },
    refetchInterval: 6000,
    enabled: !!userAddress,
  })
}
