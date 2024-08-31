'use client'

import {
  useCheckApprovedForAllQuery,
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
  useGetSingleNFTQuery,
  useUserAuctionQuery,
  useUserListingQuery,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useCheckApprovedForAllStakingQuery,
  useGetUserStakingInfoQuery,
  useGetGlobalListingOrAuctionQuery,
  useUserChainInfo,
  useMarketplaceEventQuery,
} from '@/modules/query'
import {
  useAddCollectionMutation,
  useApprovedForAllMutation,
  useCreateListingMutation,
  useMakeListingOfferMutation,
  useApprovedForAllStakingMutation,
  useClaimStakingRewardMutation,
  useStakingMutation,
  useWithdrawStakingMutation,
  useAcceptOfferMutation,
  useBitInAuctionMutation,
  useBuyFromDirectListingMutation,
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCancelOfferMutation,
  useCollectAuctionPayoutMutation,
  useCollectAuctionTokensMutation,
  useCreateAuctionMutation,
  useUpdateListingMutation,
} from '@/modules/mutation'
import {
  chainInfo,
  client,
  CROSSFI_MARKETPLACE_CONTRACT,
  CROSSFI_TEST_ASSET_ADDRESS,
} from '@/utils/configs'
import { getContractCustom, getCurrentBlockNumber, ETHERS_CONTRACT } from '@/modules/blockchain/lib'
import { ConnectButton } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { getAllListing, getAllOffers, getTotalListings, getTotalOffers } from '@/modules/blockchain'
import { ethers } from 'ethers'
import { StatusType } from '@/utils/lib/types'

export default function TestPage() {
  //  mutation
  //   const approveAllMutation = useApprovedForAllMutation()
  const createListingMutation = useCreateListingMutation()
  const createAuctionMutation = useCreateAuctionMutation()
  const addCollectionMutation = useAddCollectionMutation()

  //   const { data: fetchCollection } = useFetchCollectionsQuery()
  //   const { data: getMarketplaceCollection } = useGetMarketplaceCollectionsQuery()
  //   const { data: getSingleCollection } = useGetSingleCollectionQuery({
  //     contractAddress: '0x544C945415066564B0Fb707C7457590c0585e838',
  //     nftType: 'ERC721',
  //   })

  //   const { data: getSingleNFT } = useGetSingleNFTQuery({
  //     contractAddress: '0x544C945415066564B0Fb707C7457590c0585e838',
  //     nftType: 'ERC721',
  //     tokenId: '0',
  //   })

  //   const datagetSingleNFT = useGetSingleNFTQuery({
  //     contractAddress: '0x544C945415066564B0Fb707C7457590c0585e838',
  //     nftType: 'ERC721',
  //     tokenId: '0',
  //   })
  //   const { data: userAuction } = useUserAuctionQuery()

  //   console.log({ fetchCollection })
  //   console.log({ getMarketplaceCollection })
  //   console.log({ getSingleCollection })
  //   console.log({ getSingleNFT })
  //   console.log({ datagetSingleNFT })
  //   console.log({ userAuction })

  //   const { data: userListing } = useUserListingQuery()
  //   console.log({ userListing })

  const { data: approved } = useCheckApprovedForAllQuery({
    collectionContractAddress: CROSSFI_TEST_ASSET_ADDRESS,
  })
  const approvedData = useCheckApprovedForAllQuery({
    collectionContractAddress: CROSSFI_TEST_ASSET_ADDRESS,
  })

  console.log({ approved })
  console.log({ approvedData })

    const { data: global } = useGetGlobalListingOrAuctionQuery()
    console.log({ global })

    const recentlyListed = global?.allListing
      .filter((item) => item.status === StatusType.CREATED)
      .reverse()
      .slice(0, 20)
    const recentlySold = global?.allListing
      .filter((item) => item.status === StatusType.COMPLETED)
      .reverse()
      .slice(0, 20)
    const recentlyAuctioned = global?.allAuction
      .filter((item) => item.status === StatusType.CREATED)
      .reverse()
      .slice(0, 20)

    console.log({ recentlyListed })
    console.log({ recentlySold })
    console.log({ recentlyAuctioned })

  const userNFT = useUserNFTsQuery()
  console.log({ userNFT })

  const events = useMarketplaceEventQuery()
  console.log({ events })

  const userOffers = useUserOffersMadeQuery()
  console.log({ userOffers })

  const userListing = useUserListingQuery()
  console.log({ userListing })

  const userAuction = useUserAuctionQuery()
  console.log({ userAuction })

  const handleClick = async () => {
    // approveAllMutation.mutate({collectionContractAddress: CROSSFI_TEST_ASSET_ADDRESS})
    // createListingMutation.mutate({
    //   directListing: {
    //     assetContract: CROSSFI_TEST_ASSET_ADDRESS,
    //     tokenId: '0',
    //     pricePerToken: '10',
    //   },
    // })
    // createAuctionMutation.mutate({
    //   auctionDetails: {
    //     assetContract: CROSSFI_TEST_ASSET_ADDRESS,
    //     tokenId: '1',
    //     quantity: '1',
    //     minimumBidAmount: '1',
    //     buyoutBidAmount: '10',
    //   },
    // })
    // addCollectionMutation.mutate({
    //   collectionContractAddress: '0x544C945415066564B0Fb707C7457590c0585e838',
    //   description: 'MMMM First Collection',
    //   name: 'MMM ',
    // })
  }

  return (
    <div>
      <h1>Test</h1>
      <ConnectButton client={client} chain={chainInfo} wallets={[createWallet('io.metamask')]} />
      <button onClick={handleClick} disabled={addCollectionMutation.isPending}>
        click me
      </button>
    </div>
  )
}

// create auction

// {
//   assetContract
//   tokenId
//   quality
//   currency
//   minimumBidAmount
//   buyOutBidAmount
//   timeBuffer
//   bidBuffer
//   startTimestamp
//   endTimestamp
// }

// {
//   "assetContract": "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
//   "tokenId": "0",
//   "quantity": "1",
//   "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   "totalPrice": "10000000000000000",
//   "expirationTimestamp": "1724966514213"
// }

// {
//   listingId: 1,
//   buyFor: '',
//   quality: '',
//   currency: '',
//   expectedTotalPrice,
//   value
// }

// {
//   "assetContract": "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
//   "tokenId": "0",
//   "quantity": "1",
//   "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//   "pricePerToken": "10000000000000000000",
//   "startTimestamp": "1724371517950",
//   "endTimestamp": "1724966514213",
//   "reserved": false
// }
