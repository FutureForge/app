import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNFTs as getERC721NFTs } from "thirdweb/extensions/erc721";
import { decimals } from "thirdweb/extensions/erc20";
import { getNFTs as getERC1155NFTs } from "thirdweb/extensions/erc1155";
import { getAllListing, getAllOffers, getContract } from "@/modules/blockchain";
import { ICollection } from "@/utils/models";
import { StatusType } from "@/utils/lib/types";
import { NFT } from "thirdweb";
import { ethers } from "ethers";

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
        const contract = await getContract({
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

export function useGetSingleCollectionQuery(
  contractAddress: string,
  nftType: "ERC721" | "ERC1155"
) {
  const { data: collections } = useFetchCollectionsQuery();

  return useQuery({
    queryKey: ["collection", contractAddress, nftType],
    queryFn: async () => {
      const [allListing, allOffers] = await Promise.all([
        getAllListing(),
        getAllOffers(),
      ]);

      const contract = await getContract({
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
          const tokenContract = await getContract({
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
      floorPrice: "0",
      listedNFTs: 0,
      percentageOfListed: 0,
    },
    enabled: !!collections && !!contractAddress && !!nftType,
    refetchInterval: 60000 * 5,
  });
}
