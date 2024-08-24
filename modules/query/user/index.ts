import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { CROSSFI_API, TEST_ADDRESS } from "@/utils";
import { StatusType } from "@/utils/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  getAllOffers,
  getAllListing,
  getAllAuctions,
} from "@/modules/blockchain";

export function useUserChainInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  return { activeAccount, activeWallet };
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userNFTs", "userProfile", "profile"],
    queryFn: async () => {
      const response = await axios.get(
        `${CROSSFI_API}/token-holders?address=${TEST_ADDRESS}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );
      const userNFTs = response.data.docs;
      console.log({ userNFTs });
      return userNFTs;
    },
    enabled: !!userAddress,
  });
}

export function useUserOffersMadeQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userOffersMade", "userProfile", "profile"],
    queryFn: async () => {
      const allOffers = await getAllOffers();

      const userOffers = allOffers.filter(
        (offer) =>
          offer.offeror === userAddress && offer.status === StatusType.CREATED
      );

      return userOffers;
    },
    refetchInterval: 60000,
    enabled: !!userAddress,
  });
}

export function useUserListingQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userListing", "userProfile", "profile"],
    queryFn: async () => {
      const allListings = await getAllListing();

      const userListings = allListings.filter(
        (listing) =>
          listing.listingCreator === userAddress &&
          listing.status === StatusType.CREATED
      );

      return userListings;
    },
    refetchInterval: 60000,
    enabled: !!userAddress,
  });
}

export function useUserAuctionQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userAuction", "userProfile", "profile"],
    queryFn: async () => {
      const allAuctions = await getAllAuctions();

      const userAuctions = allAuctions.filter(
        (auction) =>
          auction.auctionCreator === userAddress &&
          auction.status === StatusType.CREATED
      );

      return userAuctions;
    },
    refetchInterval: 60000,
    enabled: !!userAddress,
  });
}
