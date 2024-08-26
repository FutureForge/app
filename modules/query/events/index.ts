import {
  getNewListing,
  getNewAuction,
  getNewBid,
  getNewOffer,
  getRecentlySold,
  getNewSale,
  getContractCustom,
} from "@/modules/blockchain";
import { useQuery } from "@tanstack/react-query";
import { NFT } from "thirdweb";
import { getNFT as getERC721NFT } from "thirdweb/extensions/erc721";
import { getNFT as getERC1155NFT } from "thirdweb/extensions/erc1155";
import { TokenType } from "@/utils/lib/types";
import { getListing, getOffer } from "@/modules/blockchain/global";

export function useMarketplaceEventQuery() {
  return useQuery({
    queryKey: ["newly", "auction", "bid", "offer", "sale", "event"],
    queryFn: async () => {
      const [newListing, newAuction, newBid, newOffer, recentlySold, newSale] =
        await Promise.all([
          getNewListing(),
          getNewAuction(),
          getNewBid(),
          getNewOffer(),
          getRecentlySold(),
          getNewSale(),
        ]);

      const newListingWithNFTs = await Promise.all(
        newListing.map(async (listing) => {
          const contract = await getContractCustom({
            contractAddress: listing.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          if (listing.listing.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(listing.listing.tokenId),
            });
          } else if (listing.listing.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(listing.listing.tokenId),
            });
          }

          return { ...listing, nft: nftData };
        })
      );

      const newAuctionWithNFTs = await Promise.all(
        newAuction.map(async (auction) => {
          const contract = await getContractCustom({
            contractAddress: auction.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          if (auction.auction.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(auction.auction.tokenId),
            });
          } else if (auction.auction.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(auction.auction.tokenId),
            });
          }
          return { ...auction, nft: nftData };
        })
      );

      const newBidWithNFTs = await Promise.all(
        newBid.map(async (bidNFT) => {
          const contract = await getContractCustom({
            contractAddress: bidNFT.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          if (bidNFT.auction.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(bidNFT.auction.tokenId),
            });
          } else if (bidNFT.auction.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(bidNFT.auction.tokenId),
            });
          }

          return { ...bidNFT, nft: nftData };
        })
      );

      const newOfferWithNFTs = await Promise.all(
        newOffer.map(async (offer) => {
          const contract = await getContractCustom({
            contractAddress: offer.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          if (offer.offer.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(offer.offer.tokenId),
            });
          } else if (offer.offer.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(offer.offer.tokenId),
            });
          }
          return { ...offer, nft: nftData };
        })
      );

      const recentlySoldWithNFTs = await Promise.all(
        recentlySold.map(async (sold) => {
          const contract = await getContractCustom({
            contractAddress: sold.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          const offerInfo = await getOffer({
            offerId: sold.offerId,
          });

          if (offerInfo.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(offerInfo.tokenId),
            });
          } else if (offerInfo.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(offerInfo.tokenId),
            });
          }

          return { ...sold, nft: nftData };
        })
      );

      const newSaleWithNFTs = await Promise.all(
        newSale.map(async (sale) => {
          const contract = await getContractCustom({
            contractAddress: sale.assetContract,
          });

          let nftData: NFT | undefined = undefined;

          const listingInfo = await getListing({
            listingId: sale.listingId,
          });

          if (listingInfo.tokenType === TokenType.ERC721) {
            nftData = await getERC721NFT({
              contract,
              tokenId: BigInt(listingInfo.tokenId),
            });
          } else if (listingInfo.tokenType === TokenType.ERC1155) {
            nftData = await getERC1155NFT({
              contract,
              tokenId: BigInt(listingInfo.tokenId),
            });
          }
        })
      );

      return {
        newListing: newListingWithNFTs,
        newAuction: newAuctionWithNFTs,
        newBid: newBidWithNFTs,
        newOffer: newOfferWithNFTs,
        recentlySold: recentlySoldWithNFTs,
        newSale: newSaleWithNFTs,
      };
    },
    initialData: {
      newListing: [],
      newAuction: [],
      newBid: [],
      newOffer: [],
      recentlySold: [],
      newSale: [],
    },
    refetchInterval: 60000 * 5,
  });
}
