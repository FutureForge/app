"use client";

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
} from "@/modules/query";
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
} from "@/modules/mutation";
import {
  chainInfo,
  chainInfoV2,
  client,
  MARKETPLACE_CONTRACT,
} from "@/utils/configs";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { getAllOffers, getTotalListings } from "@/modules/blockchain";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain/lib";
import { isBidAmountValid } from "@/utils";

export default function Home() {
  const { activeAccount } = useUserChainInfo();
  const { data: collections, isLoading } = useFetchCollectionsQuery();
  const addCollectionMutation = useAddCollectionMutation();
  const createListingMutation = useCreateListingMutation();
  const approveForAllMutation = useApprovedForAllMutation();
  const approvedForStakingMutation = useApprovedForAllStakingMutation();
  const claimStakingRewardMutation = useClaimStakingRewardMutation();
  const stakingMutation = useStakingMutation();
  const withdrawStakingMutation = useWithdrawStakingMutation();

  // direct listing
  const makeListingOfferMutation = useMakeListingOfferMutation();
  const acceptOfferMutation = useAcceptOfferMutation();
  const cancelOfferMutation = useCancelOfferMutation();
  const updateListingMutation = useUpdateListingMutation();
  const buyFromDirectListingMutation = useBuyFromDirectListingMutation();
  const cancelDirectListingMutation = useCancelDirectListingMutation();

  // auction
  const bidInAuctionMutation = useBitInAuctionMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();
  const collectAuctionPayOutMutation = useCollectAuctionPayoutMutation(); // seller
  const collectAuctionTokenMutation = useCollectAuctionTokensMutation(); // buy
  const createAuctionMutation = useCreateAuctionMutation();

  const newCollection = {
    collectionContractAddress: "0x1234567890abcdef1234567890abcdef123456789",
    name: "My Collection",
    description: "This is my collection",
  };

  console.log({ collections });

  const userNFTs = useUserNFTsQuery();
  console.log({ userNFTs });

  const contract = getContractCustom({ contractAddress: MARKETPLACE_CONTRACT });
  console.log({ contract });

  const totalListing = getTotalListings();
  console.log({ totalListing });

  const offers = getAllOffers();
  console.log({ offers });

  const { data: offersMade } = useUserOffersMadeQuery();
  console.log({ offersMade });

  const { data: userListing } = useUserListingQuery();
  console.log({ userListing });

  const { data: userAuction } = useUserAuctionQuery();
  console.log({ userAuction });

  const { data: collectionNFT } = useGetMarketplaceCollectionsQuery();
  console.log({ collectionNFT });

  const { data: singleCollection } = useGetSingleCollectionQuery(
    "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    "ERC721"
  );
  console.log({ singleCollection });

  const { data: newListingEvent } = useMarketplaceEventQuery();
  console.log({ newListingEvent });

  console.log({
    message: "create listing console",
    isPending: createListingMutation.isPending,
  });

  const { data: isApproved } = useCheckApprovedForAllQuery(
    "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229"
  );
  console.log({ isApproved });

  console.log({
    message: "approved for all console",
    isPending: approveForAllMutation.isPending,
  });

  const { data: singleNFTQuery } = useGetSingleNFTQuery({
    contractAddress: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    nftType: "ERC721",
    tokenId: "1",
  });
  console.log({ singleNFTQuery });

  const { data: approvedStaking } = useCheckApprovedForAllStakingQuery();
  console.log({ approvedStaking });

  const { data: stakingInfo } = useGetUserStakingInfoQuery();
  console.log({ stakingInfo });

  const { data: globalListingOrAuction } = useGetGlobalListingOrAuctionQuery();
  console.log({ globalListingOrAuction });
  const allAuction = globalListingOrAuction?.allAuction;

  console.log({
    message: "approved for all staking console",
    isPending: approvedForStakingMutation.isPending,
  });

  console.log({
    message: "claim staking console",
    isPending: claimStakingRewardMutation.isPending,
  });

  console.log({
    message: "stake console",
    isPending: stakingMutation.isPending,
  });

  console.log({
    message: "withdraw stake console",
    isPending: withdrawStakingMutation.isPending,
  });

  console.log({
    message: "make listing offer console",
    isPending: makeListingOfferMutation.isPending,
  });

  console.log({
    message: "accept listing offer console",
    isPending: acceptOfferMutation.isPending,
  });

  console.log({
    message: "cancel offer console",
    isPending: cancelOfferMutation.isPending,
  });

  console.log({
    message: "bid in auction console",
    isPending: bidInAuctionMutation.isPending,
  });

  console.log({
    message: "cancel in auction console",
    isPending: cancelAuctionMutation.isPending,
  });

  console.log({
    message: "collect payout auction console",
    isPending: collectAuctionPayOutMutation.isPending,
  });

  console.log({
    message: "collect payout auction console",
    isPending: collectAuctionTokenMutation.isPending,
  });

  console.log({
    message: "create auction console",
    isPending: createAuctionMutation.isPending,
  });

  console.log({
    message: "cancel listing console",
    isPending: cancelDirectListingMutation.isPending,
  });

  console.log({
    message: "update direct console",
    isPending: updateListingMutation.isPending,
  });

  console.log({
    message: "buyfor direct listing console",
    isPending: buyFromDirectListingMutation.isPending,
  });

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

    const auctionId = "0";
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
  };

  return (
    <>
      <ConnectButton
        client={client}
        chain={chainInfoV2}
        wallets={[createWallet("io.metamask")]}
      />
      <button onClick={handleAddCollection}>Click Me</button>
    </>
  );
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
