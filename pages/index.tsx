"use client";

import {
  useFetchCollectionsQuery,
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
