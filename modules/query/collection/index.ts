import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNFTs as getERC721NFTs,
  getNFT as getERC721NFT,
} from "thirdweb/extensions/erc721";
import { decimals } from "thirdweb/extensions/erc20";
import {
  getNFTs as getERC1155NFTs,
  getNFT as getERC1155NFT,
} from "thirdweb/extensions/erc1155";
import {
  getAllAuctions,
  getAllListing,
  getAllOffers,
} from "@/modules/blockchain";
import { ICollection } from "@/utils/models";
import { NFTType, StatusType } from "@/utils/lib/types";
import { NFT } from "thirdweb";
import { ethers } from "ethers";
import { decimalOffChain, getContractCustom } from "@/modules/blockchain/lib";
import {
  getIsAuctionExpired,
  getWinningBid,
} from "@/modules/blockchain/auction";

export function useFetchCollectionsQuery() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await axios.get("/api/collection");
      return response.data.data;
    },
    initialData: [],
    refetchInterval: 60000,
  });
}

export function useGetMarketplaceCollectionsQuery() {
  const { data: collections } = useFetchCollectionsQuery();

  return useQuery({
    queryKey: ["collections", "marketplace"],
    queryFn: async () => {
      if (!collections || collections.length === 0) return [];

      const nftPromises = collections.map(async (collection: ICollection) => {
        const contract = await getContractCustom({
          contractAddress: collection.collectionContractAddress,
        });

        let nftList: NFT[] = [];
        if (collection.nftType === "ERC721") {
          nftList = await getERC721NFTs({ contract });
        } else if (collection.nftType === "ERC1155") {
          nftList = await getERC1155NFTs({ contract });
        }
        return nftList;
      });

      const nftsSettled = await Promise.allSettled(nftPromises);
      const nfts = nftsSettled
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<any[]>).value);

      return nfts;
    },
    enabled: !!collections,
    refetchInterval: 60000 * 5,
  });
}

export function useGetSingleNFTQuery({
  contractAddress,
  nftType,
  tokenId,
}: {
  contractAddress: string;
  nftType: NFTType;
  tokenId: string;
}) {
  return useQuery({
    queryKey: ["nft", "auction", "listing", "offers"],
    queryFn: async () => {
      const contract = await getContractCustom({ contractAddress });

      let nftList: NFT;
      if (nftType === "ERC721") {
        nftList = await getERC721NFT({ contract, tokenId: BigInt(tokenId) });
      } else if (nftType === "ERC1155") {
        nftList = await getERC1155NFT({ contract, tokenId: BigInt(tokenId) });
      }

      const allAuctions = await getAllAuctions();
      const allListing = await getAllListing();

      const nftAuctionList = allAuctions.find(
        (auction) =>
          auction.assetContract === contractAddress &&
          auction.tokenId === BigInt(tokenId) &&
          auction.status === StatusType.CREATED
      );

      const nftListingList = allListing.find(
        (listing) =>
          listing.assetContract === contractAddress &&
          listing.tokenId === BigInt(tokenId) &&
          listing.status === StatusType.CREATED
      );

      let result: any = {};

      if (nftAuctionList) {
        const winningBid = await getWinningBid({
          auctionId: nftAuctionList.auctionId,
        });

        const isAuctionActive = await getIsAuctionExpired({
          auctionId: nftAuctionList.auctionId,
        });

        // Due to a naming mismatch in the contract, `getIsAuctionExpired` returns `true` when the auction is active and `false` when it's expired.
        // To correct this, we invert the result.
        const isAuctionExpired = !isAuctionActive;

        const winningBidBody = {
          bidder: winningBid[0],
          currency: winningBid[1],
          bidAmount: winningBid[2],
        };

        result = {
          id: "auction",
          nftAuctionList,
          isAuctionExpired,
          winningBid: winningBidBody,
        };
      } else if (nftListingList) {
        const allOffers = await getAllOffers();

        const filteredOffers = allOffers.filter((offers) => {
          return (
            offers.assetContract === contractAddress &&
            offers.tokenId === BigInt(tokenId)
          );
        });

        result = {
          id: "listing",
          nftListingList,
          offers: filteredOffers,
        };
      } else {
        result = {
          id: "none",
          message: "No auction or listing found for the given token ID.",
        };
      }

      return result;
    },
    enabled: !!contractAddress && !!nftType && !!tokenId,
    refetchInterval: 60000 * 5,
  });
}

export function useGetSingleCollectionQuery(
  contractAddress: string,
  nftType: NFTType
) {
  const { data: collections } = useFetchCollectionsQuery();

  return useQuery({
    queryKey: ["collection", "auction", contractAddress, nftType],
    queryFn: async () => {
      const [allListing, allOffers] = await Promise.all([
        getAllListing(),
        getAllOffers(),
      ]);

      const contract = await getContractCustom({
        contractAddress,
      });

      let nfts: NFT[] = [];
      if (nftType === "ERC721") {
        nfts = await getERC721NFTs({ contract });
      } else if (nftType === "ERC1155") {
        nfts = await getERC1155NFTs({ contract });
      }

      const collectionListing = allListing.filter(
        (listing) =>
          listing.assetContract === contractAddress &&
          listing.status === StatusType.CREATED
      );

      const totalVolumeCollection = allListing.filter(
        (listing) => listing.status === StatusType.COMPLETED
      );

      const totalVolume = totalVolumeCollection.reduce((acc, listing) => {
        const price = parseFloat(decimalOffChain(listing.pricePerToken));
        return acc + price;
      }, 0);

      const collectionOffers = allOffers.filter(
        (offer) =>
          offer.assetContract === contractAddress &&
          offer.status === StatusType.CREATED
      );

      const listingMap = new Map<string, any>();
      collectionListing.forEach((listing) => {
        listingMap.set(listing.tokenId.toString(), listing);
      });

      const updatedNFTs = nfts.map((nft) => {
        const listing = listingMap.get(nft.id.toString());
        return {
          ...nft,
          listing: listing || null,
        };
      });

      // Calculate formatted prices and floor price
      let totalFormattedPrice = ethers.BigNumber.from(0);
      for (const listing of collectionListing) {
        let formattedPrice: string;

        if (listing.currency === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          formattedPrice = ethers.utils.formatUnits(
            listing.pricePerToken,
            "ether"
          );
        } else {
          const tokenContract = await getContractCustom({
            contractAddress: listing.currency,
          });
          const tokenDecimals = await decimals({ contract: tokenContract });

          formattedPrice = ethers.utils.formatUnits(
            listing.pricePerToken,
            tokenDecimals
          );
        }

        totalFormattedPrice = totalFormattedPrice.add(
          ethers.utils.parseUnits(formattedPrice, 18)
        );
      }

      const collectionLength = updatedNFTs.length;
      const listedNFTs = updatedNFTs.filter(
        (nft) => nft.listing !== null
      ).length;
      const percentageOfListed = (listedNFTs / collectionLength) * 100;

      const floorPrice =
        collectionLength > 0
          ? ethers.utils.formatUnits(
              totalFormattedPrice.div(collectionLength),
              "ether"
            )
          : "0";

      return {
        nfts,
        collectionListing,
        collectionOffers,
        updatedNFTs,
        totalVolume,
        floorPrice,
        listedNFTs,
        percentageOfListed,
      };
    },
    initialData: {
      nfts: [],
      collectionListing: [],
      collectionOffers: [],
      updatedNFTs: [],
      totalVolume: 0,
      floorPrice: "0",
      listedNFTs: 0,
      percentageOfListed: 0,
    },
    enabled: !!collections && !!contractAddress && !!nftType,
    refetchInterval: 60000 * 5,
  });
}
