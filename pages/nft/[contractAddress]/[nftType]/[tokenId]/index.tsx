'use client'

import { useRouter } from 'next/router'
import { decimalOffChain } from '@/modules/blockchain'
import { NFTTypeV2 } from '@/utils/lib/types'
import {
  useCheckApprovedForAllQuery,
  useGetSingleNFTQuery,
  useUserChainInfo,
} from '@/modules/query'
import { client } from '@/utils/configs'
import { MediaRenderer } from 'thirdweb/react'
import { Button } from '@/modules/app'
import { formatBlockchainTimestamp, getFormatAddress } from '@/utils'
import {
  useApprovedForAllMutation,
  useCreateListingMutation,
  useBuyFromDirectListingMutation,
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCollectAuctionPayoutMutation,
  useCollectAuctionTokensMutation,
  useCreateAuctionMutation,
  useBidInAuctionMutation,
} from '@/modules/mutation'
import { useState } from 'react'

const NFTDetailPage = () => {
  const { activeAccount, activeWallet } = useUserChainInfo()
  const address = activeAccount?.address
  const chain = activeWallet?.getChain()
  const router = useRouter()
  const { contractAddress, nftType, tokenId } = router.query

  const [value, setValue] = useState('')
  const [buyOutAmount, setBuyOutAmount] = useState('2')

  // mutation

  // auction
  const bidInAuctionMutation = useBidInAuctionMutation()
  const cancelAuctionMutation = useCancelAuctionMutation()
  const createAuctionMutation = useCreateAuctionMutation()
  const collectAuctionPayoutMutation = useCollectAuctionPayoutMutation()
  const collectAuctionTokensMutation = useCollectAuctionTokensMutation()

  // direct listing
  const cancelDirectListingMutation = useCancelDirectListingMutation()
  const buyFromDirectListingMutation = useBuyFromDirectListingMutation()
  const createListingMutation = useCreateListingMutation()

  const approvedForAllMutation = useApprovedForAllMutation()

  // mutation

  const isTxPending =
    bidInAuctionMutation.isPending ||
    cancelAuctionMutation.isPending ||
    cancelDirectListingMutation.isPending ||
    buyFromDirectListingMutation.isPending ||
    createAuctionMutation.isPending ||
    createListingMutation.isPending ||
    approvedForAllMutation.isPending ||
    collectAuctionPayoutMutation.isPending ||
    collectAuctionTokensMutation.isPending

  const { data: isApproved } = useCheckApprovedForAllQuery({
    collectionContractAddress: contractAddress as string,
  })
  const {
    data: nftData,
    isLoading,
    isError,
  } = useGetSingleNFTQuery({
    contractAddress: contractAddress as string,
    nftType: nftType as NFTTypeV2,
    tokenId: tokenId as string,
  })

  const { id, isAuctionExpired, nft, nftAuctionList, winningBid, message, nftListingList, offers } =
    nftData || {}

  console.log({
    isAuctionExpired,
    nftAuctionList,
    winningBid,
    nft,
    id,
    message,
    nftListingList,
    offers,
  })

  console.log('mutation status', collectAuctionPayoutMutation)

  const owner =
    id === 'listing' ? nft?.owner : id === 'auction' ? nftAuctionList?.auctionCreator : nft?.owner
  const isOwner = owner === address

  console.log({ isOwner })

  const handleApproveNFT = async () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')

    approvedForAllMutation.mutate({
      collectionContractAddress: contractAddress as string,
    })
  }

  const handleCreateListing = async () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!value) return alert('Please enter a valid listing amount.')

    createListingMutation.mutate({
      directListing: {
        assetContract: contractAddress as string,
        tokenId: tokenId as string,
        quantity: '1',
        pricePerToken: value,
        endTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  }

  const handleCreateAuction = async () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!value) return alert('Please enter a valid auction amount.')
    if (!buyOutAmount) return alert('Please enter a valid auction amount.')

    createAuctionMutation.mutate({
      auctionDetails: {
        assetContract: contractAddress as string,
        tokenId: tokenId as string,
        quantity: '1',
        minimumBidAmount: value,
        buyoutBidAmount: buyOutAmount,
      },
    })
  }

  const handlePlaceBidAuction = async () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!value) return alert('Please enter a valid bid amount.')
    if (Number(value) < Number(decimalOffChain(winningBid?.bidAmount)))
      return alert('Bid amount should be greater than current winning')
    if (isOwner) return alert('Owner cant buy own listing')

    bidInAuctionMutation.mutate(
      {
        auctionId: nftAuctionList?.auctionId,
        bidAmount: value,
      },
      {
        onSuccess: (data: any) => {
          alert('Bid placed successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
          setValue('')
        },
      },
    )
  }

  const handleBuyOutDirectListing = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (isOwner) return alert('Owner cant buy own listing')

    buyFromDirectListingMutation.mutate(
      {
        buyFromListing: {
          buyFor: activeAccount?.address,
          listingId: nftListingList?.listingId,
          quantity: nftListingList?.quantity,
          nativeTokenValue: decimalOffChain(nftListingList?.pricePerToken),
          totalPrice: decimalOffChain(nftListingList?.pricePerToken),
        },
      },
      {
        onSuccess: (data: any) => {
          alert('NFT Bought Successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
          setValue('')
        },
      },
    )
  }

  const handleBuyOutAuction = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')

    bidInAuctionMutation.mutate(
      {
        auctionId: nftAuctionList?.auctionId,
        bidAmount: decimalOffChain(nftAuctionList?.buyoutBidAmount)!,
      },
      {
        onSuccess: (data: any) => {
          alert('Bid placed successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
          setValue('')
        },
      },
    )
  }

  const handleCancelDirectListing = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!isOwner) return alert('Only the owner can cancel the listing.')

    cancelDirectListingMutation.mutate(
      { listingId: nftListingList?.listingId },
      {
        onSuccess: (data: any) => {
          alert('Canceled Direct Listing Successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
        },
      },
    )
  }

  const handleCancelAuction = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!isOwner) return alert('Only the owner can cancel the listing.')

    cancelAuctionMutation.mutate(
      { auctionId: nftAuctionList?.auctionId },
      {
        onSuccess: (data: any) => {
          alert('Cancelled Auction Successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
        },
      },
    )
  }

  const handleClaimAuctionPayout = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (nftAuctionList?.auctionCreator === address)
      return alert('Only the auction creator can claim payout the listing.')

    collectAuctionPayoutMutation.mutate(
      { auctionId: nftAuctionList?.auctionId },
      {
        onSuccess: (data: any) => {
          alert('Auction Reward claimed Successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
        },
      },
    )
  }

  const handleClaimAuctionNFT = () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    console.log(winningBid?.bidder)
    console.log(address)
    if (winningBid?.bidder !== address) return alert('Only bidder can claim the NFT')

    collectAuctionTokensMutation.mutate(
      { auctionId: nftAuctionList?.auctionId },
      {
        onSuccess: (data: any) => {
          alert('Auction NFT claimed Successfully!')
          setValue('')
          console.log({ data })
        },
        onError: (error: any) => {
          alert(error.message)
        },
      },
    )
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading NFT details.</p>

  return (
    <div className="container mx-auto md:px-14 px-4 h-[80vh] items-center justify-center flex mt-5">
      <div className="grid grid-cols-2 w-full  gap-12">
        <div className="">
          <MediaRenderer
            client={client}
            src={nft?.metadata?.image}
            className="w-full rounded-lg shadow-lg h-full"
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className=" flex flex-col gap-8">
            <span className="flex flex-col gap-4 pb">
              <h3 className="text-[30px] font-semibold">
                {nft?.metadata?.name} #{nft?.id}
              </h3>
              <p>
                Owned by{' '}
                <span className="text-special">
                  {getFormatAddress(id === 'auction' ? nftAuctionList?.auctionCreator : nft?.owner)}
                </span>
              </p>
            </span>
            <div>
              <p className="font-semibold border-b border-b-white/25 pb-7">Description</p>

              <div className="pt-7">
                {/* <p className="text-[#8A939B]">
                  By <span className="font-semibold text-foreground">Producers</span>
                </p> */}

                <p className="text-sm mt-2">
                  {nft?.metadata?.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[#8A939B]">
            <span className="font-semibold text-foreground">
              {id === 'listing' ? 'Listed' : id === 'auction' ? 'English Auction' : ''}
            </span>
          </p>

          <div className="bg-special-bg w-full p-8 flex items-center justify-center flex-col gap-6 rounded-2xl">
            <div className="flex items-center justify-between w-full">
              {id === 'listing' && (
                <>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Listing Price</p>
                    <h3 className="text-2xl font-bold">
                      {decimalOffChain(nftListingList?.pricePerToken) || '0'} XFI
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Type</p>
                    <h3 className="text-2xl font-bold">CRC-721</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Id</p>
                    <h3 className="text-2xl font-bold">{nft?.id}</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Available On:</p>
                    <h3 className="text-2xl font-bold">
                      {formatBlockchainTimestamp(nftListingList?.startTimestamp)}
                    </h3>
                  </div>
                </>
              )}

              {id === 'auction' && (
                <>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Buyout Price</p>
                    <h3 className="text-2xl font-bold">
                      {decimalOffChain(nftAuctionList?.buyoutBidAmount) || '0'} XFI
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Minimum Bid</p>
                    <h3 className="text-2xl font-bold">
                      {decimalOffChain(nftAuctionList?.minimumBidAmount) || '0'} XFI
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Type</p>
                    <h3 className="text-2xl font-bold">CRC-721</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Id</p>
                    <h3 className="text-2xl font-bold">{nft?.id}</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Ends on</p>
                    <h3 className="text-2xl font-bold">
                      {formatBlockchainTimestamp(nftAuctionList?.endTimestamp)}
                    </h3>
                  </div>
                </>
              )}

              {id === 'none' && (
                <>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Type</p>
                    <h3 className="text-2xl font-bold">CRC-721</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="capitalize">Token Id</p>
                    <h3 className="text-2xl font-bold">{nft?.id}</h3>
                  </div>
                </>
              )}
            </div>

            <input
              type="numbers"
              placeholder="Enter your bid amount"
              className="w-full p-4 rounded-md text-sm font-medium border-gray-200 text-black"
              autoComplete="off"
              required
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
              }}
            />

            {/* BUYER BUTTON */}
            {!isOwner && (
              <>
                {id === 'listing' && (
                  <Button
                    onClick={handleBuyOutDirectListing}
                    variant="secondary"
                    disabled={isTxPending}
                    className="text-sm font-medium h-8"
                  >
                    Buy Now
                  </Button>
                )}
                {id === 'auction' && (
                  <>
                    {isAuctionExpired ? (
                      <>
                        {winningBid?.bidder === address ? (
                          <>
                            {' '}
                            <Button
                              onClick={handleClaimAuctionNFT}
                              variant="secondary"
                              disabled={isTxPending}
                              className="text-sm font-medium h-8"
                            >
                              Claim Auction NFT
                            </Button>
                          </>
                        ) : (
                          <>
                            {winningBid?.bidder
                              ? 'Auction Has Been Completed'
                              : 'Auction Has Expired'}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={handlePlaceBidAuction}
                          variant="secondary"
                          disabled={isTxPending}
                          className="text-sm font-medium h-8"
                        >
                          Place Bid
                        </Button>
                        <Button
                          onClick={handleBuyOutAuction}
                          variant="secondary"
                          disabled={isTxPending}
                          className="text-sm font-medium h-8"
                        >
                          Buy Auction
                        </Button>
                      </>
                    )}
                  </>
                )}

                {id === 'none' && (
                  <Button
                    onClick={() => {}}
                    variant="secondary"
                    disabled={isTxPending}
                    className="text-sm font-medium h-8"
                  >
                    Make Offer
                  </Button>
                )}
              </>
            )}
            {/* BUYER BUTTON */}

            {/* SELLER BUTTON */}
            {isOwner && (
              <>
                {id === 'none' && (
                  <>
                    {!isApproved ? (
                      <Button
                        onClick={handleApproveNFT}
                        variant="secondary"
                        disabled={isTxPending}
                        className="text-sm font-medium h-8"
                      >
                        Approve Spending
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {}}
                        variant="secondary"
                        disabled={isTxPending}
                        className="text-sm font-medium h-8"
                      >
                        List/Auction
                      </Button>
                    )}
                  </>
                )}
                {id === 'listing' && (
                  <Button
                    onClick={handleCancelDirectListing}
                    variant="secondary"
                    disabled={isTxPending}
                    className="text-sm font-medium h-8"
                  >
                    Cancel Direct Listing
                  </Button>
                )}
                {id === 'auction' && (
                  <>
                    {isAuctionExpired && nftAuctionList?.auctionCreator === address ? (
                      <Button
                        onClick={handleClaimAuctionPayout}
                        variant="secondary"
                        disabled={isTxPending}
                        className="text-sm font-medium h-8"
                      >
                        Claim Auction Payout
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCancelAuction}
                        variant="secondary"
                        disabled={isTxPending}
                        className="text-sm font-medium h-8"
                      >
                        Cancel Auction
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
            {/* SELLER BUTTON */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTDetailPage
