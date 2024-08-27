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

  // auction
  const bidInAuctionMutation = useBitInAuctionMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();

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

  const handleAddCollection = async () => {
    // addCollectionMutation.mutate(newCollection);

    // createListingMutation.mutate({
    //   directListing: {
    //     assetContract: "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    //     tokenId: "3",
    //     quantity: "1",
    //     pricePerToken: "0.01",
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
    //     // currency: '',
    //     totalPrice: "0.001",
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

    cancelAuctionMutation.mutate({ auctionId });
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
