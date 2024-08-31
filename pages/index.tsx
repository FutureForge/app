'use client'

import {
  useCheckApprovedForAllQuery,
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
  useGetSingleNFTQuery,
  useMarketplaceEventQuery,
  useUserAuctionQuery,
  useUserListingQuery,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
  useCheckApprovedForAllStakingQuery,
  useGetUserStakingInfoQuery,
  useGetGlobalListingOrAuctionQuery,
  useUserChainInfo,
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
import { chainInfo, chainInfoV2, client, MARKETPLACE_CONTRACT } from '@/utils/configs'
import { ConnectButton } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { getAllOffers, getTotalListings } from '@/modules/blockchain'
import { decimalOffChain, getContractCustom } from '@/modules/blockchain/lib'
import { isBidAmountValid } from '@/utils'
import React, { useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/modules/components/header/header'

export default function Home() {
  // const { activeAccount, activeWallet } = useUserChainInfo();
  const { data: collections, isLoading } = useFetchCollectionsQuery()
  // const addCollectionMutation = useAddCollectionMutation();
  // const createListingMutation = useCreateListingMutation();
  // const approveForAllMutation = useApprovedForAllMutation();
  // const approvedForStakingMutation = useApprovedForAllStakingMutation();
  // const claimStakingRewardMutation = useClaimStakingRewardMutation();
  // const stakingMutation = useStakingMutation();
  // const withdrawStakingMutation = useWithdrawStakingMutation();

  // // direct listing
  // const makeListingOfferMutation = useMakeListingOfferMutation();
  // const acceptOfferMutation = useAcceptOfferMutation();
  // const cancelOfferMutation = useCancelOfferMutation();
  // const updateListingMutation = useUpdateListingMutation();
  // const buyFromDirectListingMutation = useBuyFromDirectListingMutation();
  // const cancelDirectListingMutation = useCancelDirectListingMutation();

  // // auction
  // const bidInAuctionMutation = useBitInAuctionMutation();
  // const cancelAuctionMutation = useCancelAuctionMutation();
  // const collectAuctionPayOutMutation = useCollectAuctionPayoutMutation(); // seller
  // const collectAuctionTokenMutation = useCollectAuctionTokensMutation(); // buy
  // const createAuctionMutation = useCreateAuctionMutation();

  // const newCollection = {
  //   collectionContractAddress: "0x1234567890abcdef1234567890abcdef123456789",
  //   name: "My Collection",
  //   description: "This is my collection",
  // };

  const [nftName, setNftName] = useState('')
  const [nftDescription, setNftDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  console.log({ collections })

  const userNFTs = useUserNFTsQuery()
  console.log({ userNFTs })

  // const { data: offersMade } = useUserOffersMadeQuery();
  // console.log({ offersMade });

  // const { data: userListing } = useUserListingQuery();
  // console.log({ userListing });

  // const { data: userAuction } = useUserAuctionQuery();
  // console.log({ userAuction });

  const { data: collectionNFT } = useGetMarketplaceCollectionsQuery()
  console.log({ collectionNFT })

  // const { data: singleCollection } = useGetSingleCollectionQuery(
  //   "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
  //   "ERC721"
  // );
  // console.log({ singleCollection });



  // console.log({
  //   message: "create listing console",
  //   isPending: createListingMutation.isPending,
  // });

  // const { data: isApproved } = useCheckApprovedForAllQuery(
  //   "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229"
  // );
  // console.log({ isApproved });

  // console.log({
  //   message: "approved for all console",
  //   isPending: approveForAllMutation.isPending,
  // });

  const { data: singleNFTQuery } = useGetSingleNFTQuery({
    // contractAddress: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    contractAddress: '0xf99a92477F75569BD0F1a6624425C92F73E755Dd',
    nftType: 'ERC721',
    tokenId: '4',
  })
  console.log({ singleNFTQuery })

  // const { data: approvedStaking } = useCheckApprovedForAllStakingQuery();
  // console.log({ approvedStaking });

  const { data: stakingInfo } = useGetUserStakingInfoQuery()
  console.log({ stakingInfo })

  const { data: globalListingOrAuction } = useGetGlobalListingOrAuctionQuery()
  console.log({ globalListingOrAuction })
  // const allAuction = globalListingOrAuction?.allAuction;

  // console.log({
  //   message: "approved for all staking console",
  //   isPending: approvedForStakingMutation.isPending,
  // });

  // console.log({
  //   message: "claim staking console",
  //   isPending: claimStakingRewardMutation.isPending,
  // });

  // console.log({
  //   message: "stake console",
  //   isPending: stakingMutation.isPending,
  // });

  // console.log({
  //   message: "withdraw stake console",
  //   isPending: withdrawStakingMutation.isPending,
  // });

  // console.log({
  //   message: "make listing offer console",
  //   isPending: makeListingOfferMutation.isPending,
  // });

  // console.log({
  //   message: "accept listing offer console",
  //   isPending: acceptOfferMutation.isPending,
  // });

  // console.log({
  //   message: "cancel offer console",
  //   isPending: cancelOfferMutation.isPending,
  // });

  // console.log({
  //   message: "bid in auction console",
  //   isPending: bidInAuctionMutation.isPending,
  // });

  // console.log({
  //   message: "cancel in auction console",
  //   isPending: cancelAuctionMutation.isPending,
  // });

  // console.log({
  //   message: "collect payout auction console",
  //   isPending: collectAuctionPayOutMutation.isPending,
  // });

  // console.log({
  //   message: "collect payout auction console",
  //   isPending: collectAuctionTokenMutation.isPending,
  // });

  // console.log({
  //   message: "create auction console",
  //   isPending: createAuctionMutation.isPending,
  // });

  // console.log({
  //   message: "cancel listing console",
  //   isPending: cancelDirectListingMutation.isPending,
  // });

  // console.log({
  //   message: "update direct console",
  //   isPending: updateListingMutation.isPending,
  // });

  // console.log({
  //   message: "buyfor direct listing console",
  //   isPending: buyFromDirectListingMutation.isPending,
  // });

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddCollection = async () => {
    // addCollectionMutation.mutate(newCollection);

    // const params = {
    //   assetContract: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    //   tokenId: "0",
    //   quantity: "1",
    //   currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //   pricePerToken: "10000000000000000000",
    //   startTimestamp: "1724371517950",
    //   endTimestamp: "1724966514213",
    //   reserved: false,
    // };

    // createListingMutation.mutate({
    //   directListing: {
    //     assetContract: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    //     tokenId: "1",
    //     quantity: "1",
    //     pricePerToken: "0.0001",
    //     // startTimestamp: "1724575286588",
    //     // endTimestamp: "1724966514213",
    //   },
    // });

    // approveForAllMutation.mutate({
    //   collectionContractAddress: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    // });

    // approvedForStakingMutation.mutate();

    // claimStakingRewardMutation.mutate({ tokenId: "5" });

    // stakingMutation.mutate({ tokenId: "5" });

    // withdrawStakingMutation.mutate({ tokenId: "5" });

    // makeListingOfferMutation.mutate({
    //   makeOffer: {
    //     assetContract: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    //     tokenId: "0",
    //     quantity: "1",
    //     currency: "0x99a08a9AA59434cA893aE1A2E771Cf26b1B92E7A", // native currency should be the wrapped token but treat it as the native currency
    //     totalPrice: "100",
    //     // expirationTimestamp: ''
    //   },
    // });

    // acceptOfferMutation.mutate({ offerId: "1" });

    // cancelOfferMutation.mutate({ offerId: "1" });

    const auctionId = '0'
    // const bidAmount = "0.008";
    // const percentageIncrease = 1;

    // if (!allAuction) return;
    // const auction = allAuction.find(
    //   (auction) => auction.auctionId === BigInt("0")
    // );
    // console.log({ auction });
    // if (!auction) {
    //   alert("Auction not found");
    //   return;
    // }

    // const isValidBid = isBidAmountValid({
    //   currentBid: Number(decimalOffChain(Number(auction.winningBid.bidAmount))),
    //   newBidAmount: Number(bidAmount),
    //   percentageIncrease,
    // });

    // if (!isValidBid) {
    //   alert(
    //     `Bid amount should be higher than the current winning bid by ${percentageIncrease}`
    //   );
    //   return;
    // }

    // bidInAuctionMutation.mutate({ auctionId, bidAmount });

    // cancelAuctionMutation.mutate({ auctionId });

    // collectAuctionPayOutMutation.mutate({ auctionId });
    // collectAuctionTokenMutation.mutate({ auctionId });

    // createAuctionMutation.mutate({
    //   auctionDetails: {
    //     assetContract: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    //     tokenId: "0",
    //     quantity: "1",
    //     minimumBidAmount: "0.001",
    //     buyoutBidAmount: "0.001",
    //   },
    // });

    // cancelDirectListingMutation.mutate({ listingId: "12" });

    // updateListingMutation.mutate({
    //   listingId: "12",
    //   directListing: {
    //     assetContract: '0x7b26dA758df7A5E101c9ac0DBA8267B95175F229',
    //     pricePerToken: "0.01",
    //     endTimestamp: "1724966514213",4880451148 //
    //     quantity: '1',
    //     tokenId: '0',
    //   },
    // });

    // buyFromDirectListingMutation.mutate({
    //   buyFromListing: {
    //     listingId: "17",
    //     buyFor: activeAccount?.address,
    //     quantity: "1",
    //     currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //     totalPrice: "0.0001",
    //   },
    // });
  }

    const { data: newListingEvent } = useMarketplaceEventQuery()
    const { newListing, newAuction, newSaleListing, recentlySoldAuction } = newListingEvent

    console.log('====================================');
    console.log(newListingEvent, 'Look at me');
    console.log('====================================');

    const [filter, setFilter] = useState<
      'All' | 'Recently Listed' | 'Recently Sold' | 'Recent Auctioned'
    >('All')



  // Filtering logic
  const filteredData = (() => {
    switch (filter) {
      case 'Recently Listed':
        return newListing
      case 'Recently Sold':
        return newSaleListing
      case 'Recent Auctioned':
        return newAuction
      case 'All':
      default:
        return [...(newListing || []), ...(newSaleListing || []), ...(newAuction || [])]
    }
  })()

  const handleMintNFT = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const reset = () => {
    setImageUrl(null)
  }
const filteredDataWithNft = filteredData.filter((item) => item.nft !== undefined)
  return (
    <div className="h-screen md:px-14">
      <Head>
        <title>MintMingle, marketplace for NFTs</title>
        {/* <meta
          name="description"
          content="A community driven token that comes with additional warm gesture, rewards and credit back hampers."
        /> */}
      </Head>

      {/* <div className="flex items-center gap-3">
        {['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned'].map((f) => (
          <button
            key={f}
            className={`px-4 py-1 m-2 rounded-xl hover:text-foreground ${
              filter === f ? 'bg-sec-bg text-foreground' : 'text-muted-foreground'
            } transition ease-in-out duration-200`}
            onClick={() => setFilter(f as any)}
          >
            {f}
          </button>
        ))}
      </div> */}
      <div className='h-screen'>
        <Header />
      </div>

      {/* <div>
        {filteredData?.length ? (
          filteredData.map((listingItem, index) => {
            const nft = listingItem.nft
            const listings = listingItem.listing
            const imageUrl = nft?.metadata.image
            console.log('====================================')
            console.log(filteredData, 'looku')
            console.log('====================================')

            return (
              <div key={index}>
                <Image
                  src={
                    imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '/assets/webp/1.webp'
                  }
                  alt={nft?.metadata.name || 'NFT'}
                  width={300}
                  height={300}
                />
                <p className="text-foreground">{nft?.metadata.name}</p>
                <p className="text-foreground">{nft?.metadata.description}</p>
              </div>
            )
          })
        ) : (
          <p>No data available</p>
        )}
      </div> */}
      {/* <div>
        {filteredData.map((item, index) => {
          // Extracting the NFT and listing data from the filtered item
          const nft = item.nft
          const listing = item.listing || item.auction // Depending on the type of the filtered item
          const imageUrl = nft?.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')

          return (
            <div key={index} className="listing-card">
              <Image
                src={imageUrl || '/default-placeholder.png'}
                alt={nft?.metadata?.name || 'NFT Image'}
                width={500}
                height={500}
                className="nft-image"
              />
              <div className="nft-details">
                <h3>{nft?.metadata?.name || 'Unnamed NFT'}</h3>
                <p>{nft?.metadata?.description || 'No description available.'}</p>
                {listing && (
                  <>
                    <p>
                      Price: {listing.pricePerToken?.toString() || listing.startingBid?.toString()}{' '}
                      wei
                    </p>
                    <p>Quantity: {listing.quantity?.toString() || 'N/A'}</p>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div> */}
      <input
        type="text"
        value={nftName}
        placeholder="Enter NFT Name"
        onChange={(e) => setNftName(e.target.value)}
      />
      <input
        type="text"
        value={nftDescription}
        placeholder="Set NFT Description"
        onChange={(e) => setNftDescription(e.target.value)}
      />
      <input onChange={handleMintNFT} type="file" accept="image/*" ref={fileInputRef} />
      {imageUrl && (
        <>
          <img height="100px" width="100px" src={imageUrl} alt="NFT" />
          <button onClick={reset}>reset</button>
        </>
      )}
      <button onClick={handleAddCollection}>Click Me</button>
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
