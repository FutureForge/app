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
import { getContractCustom } from "@/modules/blockchain/lib";

export default function Home() {
  const { data: collections, isLoading } = useFetchCollectionsQuery();
  const addCollectionMutation = useAddCollectionMutation();
  const createListingMutation = useCreateListingMutation();
  const approveForAllMutation = useApprovedForAllMutation();
  const approvedForStakingMutation = useApprovedForAllStakingMutation();
  const claimStakingRewardMutation = useClaimStakingRewardMutation();
  const stakingMutation = useStakingMutation();
  const withdrawStakingMutation = useWithdrawStakingMutation();

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
