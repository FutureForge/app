"use client";

import {
  useFetchCollectionsQuery,
  useGetMarketplaceCollectionsQuery,
  useGetSingleCollectionQuery,
  useUserAuctionQuery,
  useUserListingQuery,
  useUserNFTsQuery,
  useUserOffersMadeQuery,
} from "@/modules/query";
import { useAddCollectionMutation } from "@/modules/mutation";
import { chainInfo, chainInfoV2, client, MARKETPLACE_CONTRACT } from "@/utils";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import {
  getAllOffers,
  getContract,
  getTotalListings,
} from "@/modules/blockchain";

export default function Home() {
  const { data: collections, isLoading } = useFetchCollectionsQuery();
  const addCollectionMutation = useAddCollectionMutation();

  const newCollection = {
    collectionContractAddress: "0x1234567890abcdef1234567890abcdef123456789",
    name: "My Collection",
    description: "This is my collection",
  };

  console.log({ collections });

  // if (isLoading) return <p>Loading...</p>;

  const userNFTs = useUserNFTsQuery();
  console.log({ userNFTs });

  const contract = getContract({ contractAddress: MARKETPLACE_CONTRACT });
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

  const data = useGetMarketplaceCollectionsQuery();
  console.log({ data });

  const { data: collectionNFT } = useGetMarketplaceCollectionsQuery();
  console.log({ collectionNFT });

  const { data: singleCollection } = useGetSingleCollectionQuery(
    "0x7b26dA758df7A5E101c9ac0DBA8267B95175F229",
    "ERC721"
  );
  console.log({ singleCollection });

  const handleAddCollection = async () => {
    // addCollectionMutation.mutate(newCollection);
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
