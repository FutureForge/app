import { getNFT as getCFC721NFT } from "thirdweb/extensions/erc721";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { CROSSFI_API, TEST_WALLET_ADDRESS } from "@/utils/configs";
import { NFTResponse, StatusType } from "@/utils/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  getAllOffers,
  getAllListing,
  getAllAuctions,
  getContractCustom,
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
      const response = await axios.get<NFTResponse>(
        `${CROSSFI_API}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );
      const userNFTs = response.data.docs;

      const updatedNFTs = userNFTs.map(async (nfts) => {
        const tokenIds = nfts.tokenIds;

        const contract = await getContractCustom({
          contractAddress: nfts.contractAddress,
        });

        const tokenIdNFTs = tokenIds.map(async (ids) => {
          const nft = await getCFC721NFT({ contract, tokenId: BigInt(ids) });

          return { ...nfts, nft };
        });

        return await Promise.all(tokenIdNFTs);
      });

      return await Promise.all(updatedNFTs);
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
    refetchInterval: 6000,
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
    refetchInterval: 6000,
    enabled: !!userAddress,
  });
}

export function useUserAuctionQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useQuery({
    queryKey: ["userAuction", "userProfile", "profile", "auction"],
    queryFn: async () => {
      const allAuctions = await getAllAuctions();

      const userAuctions = allAuctions.filter(
        (auction) =>
          auction.auctionCreator === userAddress &&
          auction.status === StatusType.CREATED
      );

      return userAuctions;
    },
    refetchInterval: 6000,
    enabled: !!userAddress,
  });
}
