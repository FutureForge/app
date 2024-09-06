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
import { Button, Loader } from '@/modules/app'
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
import Image from 'next/image'
import { Dialog } from '@/modules/app/component/dialog'
import { NFTDialog } from '@/modules/components/nft-details'

const NFTDetailPage = () => {
  const { activeAccount, activeWallet } = useUserChainInfo()
  const address = activeAccount?.address
  const chain = activeWallet?.getChain()
  const router = useRouter()
  const { contractAddress, nftType, tokenId } = router.query

  const [value, setValue] = useState<string | undefined>(undefined)
  const [buyOutAmount, setBuyOutAmount] = useState<string | undefined>(undefined)
  const [endTimestamp, setEndTimestamp] = useState<Date | undefined>(undefined)

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

  console.log('mutation status', buyFromDirectListingMutation)

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
    if (!endTimestamp) return alert('Please select an end date')

    createListingMutation.mutate({
      directListing: {
        assetContract: contractAddress as string,
        tokenId: tokenId as string,
        quantity: '1',
        pricePerToken: value,
        endTimestamp: endTimestamp,
        // endTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  }

  const handleCreateAuction = async () => {
    if (!address) return alert('Please connect to a wallet.')
    if (chain?.id !== 4157) return alert('Please switch to CrossFi Testnet.')
    if (!value) return alert('Please enter a valid auction amount.')
    if (!buyOutAmount) return alert('Please enter a valid auction amount.')
    if (!endTimestamp) return alert('Please select an end date')

    createAuctionMutation.mutate({
      auctionDetails: {
        assetContract: contractAddress as string,
        tokenId: tokenId as string,
        quantity: '1',
        minimumBidAmount: value,
        buyoutBidAmount: buyOutAmount,
        endTimestamp: endTimestamp,
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

  console.log({ value, buyOutAmount, endTimestamp })

  if (isLoading || isError) return <Loader />
  // if (isError) return <p>Error loading NFT details.</p>

  const imageUrl = nft?.metadata.image

  return (
    <div className="container h-full mx-auto items-center gap-8 md:px-14 px-4 max-md:flex-col justify-center flex mt-5 max-w-[1550px]">
      <div className="h-[500px] md:w-1/2 w-full relative">
        <MediaRenderer
          client={client}
          src={nft?.metadata?.image || '/logo.svg'}
          className="rounded-2xl"
          style={{ maxHeight: '100%', width: '100%', height: '100%' }}
        />
      </div>
      <div className="flex flex-col gap-8 h-full max-md:w-full">
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

        <div className="bg-special-bg w-full p-6 flex items-center justify-center flex-col gap-6 rounded-2xl">
          <div className="md:flex md:items-center grid grid-cols-2 justify-between max-md:flex-col w-full gap-3">
            <div className="flex flex-col gap-2">
              <p className="capitalize text-sm">
                {id === 'listing' ? 'Listing Price' : id === 'auction' ? 'Buyout Price' : ''}
              </p>
              {id === 'listing' && (
                <h3 className="text-xl font-bold">
                  {decimalOffChain(nftListingList?.pricePerToken) || '0'} XFI
                </h3>
              )}

              {id === 'auction' && (
                <h3 className="text-xl font-bold">
                  {decimalOffChain(nftAuctionList?.buyoutBidAmount) || '0'} XFI
                </h3>
              )}
            </div>

            {id === 'auction' && (
              <div className="flex flex-col gap-2">
                <p className="capitalize text-sm">Minimum Bid</p>
                <h3 className="text-xl font-bold">
                  {decimalOffChain(nftAuctionList?.minimumBidAmount) || '0'} XFI
                </h3>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <p className="capitalize text-sm">Token Type</p>
              <h3 className="text-xl font-bold">CRC-721</h3>
            </div>
            <div className="flex flex-col gap-2 md:items-center">
              <p className="capitalize text-sm">Token Id</p>
              <h3 className="text-xl font-bold">{nft?.id}</h3>
            </div>

            {id === 'listing' && (
              <div className="flex flex-col gap-2">
                <p className="capitalize text-sm">Available On:</p>
                <h3 className="text-xl font-bold">
                  {formatBlockchainTimestamp(nftListingList?.startTimestamp)}
                </h3>
              </div>
            )}

            {id === 'auction' && (
              <div className="flex flex-col gap-2">
                <p className="capitalize text-sm">Ends on</p>
                <h3 className="text-xl font-bold">
                  {formatBlockchainTimestamp(nftAuctionList?.endTimestamp)}
                </h3>
              </div>
            )}
          </div>

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
                // <Dialog.Root>
                //   <Dialog.Trigger>
                //     <Button
                //       onClick={handleBuyOutDirectListing}
                //       variant="secondary"
                //       disabled={isTxPending}
                //       className="text-sm font-medium h-8"
                //     >
                //       Buy Now
                //     </Button>
                //   </Dialog.Trigger>
                //   <Dialog.Content className="max-w-[690px] w-full p-6">
                //     <NFTDialog
                //       id={id}
                //       placeholder="1 month"
                //       ctaText="Continue"
                //       src={imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '/logo.svg'}
                //       title={nft?.metadata?.name}
                //     />
                //   </Dialog.Content>
                // </Dialog.Root>
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
                    <div className="flex items-center w-full max-md:flex-col gap-3">
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Button
                            variant="secondary"
                            disabled={isTxPending}
                            className="text-sm font-medium h-8"
                          >
                            Place Bid
                          </Button>
                        </Dialog.Trigger>

                        <Dialog.Content className="max-w-[690px] w-full p-6">
                          <NFTDialog
                            id={id}
                            nftList={nftAuctionList}
                            onClick={handlePlaceBidAuction}
                            onChange={setValue}
                            disabled={isTxPending}
                            value={value}
                            placeholder="1 month"
                            ctaText="Place Bid"
                            src={
                              imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '/logo.svg'
                            }
                            title={nft?.metadata?.name}
                          />
                        </Dialog.Content>
                      </Dialog.Root>

                      <Button
                        onClick={handleBuyOutAuction}
                        variant="secondary"
                        disabled={isTxPending}
                        className="text-sm font-medium h-8"
                      >
                        Buy Auction
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* {id === 'none' && (
                <Button
                  onClick={() => {}}
                  variant="secondary"
                  disabled={isTxPending}
                  className="text-sm font-medium h-8"
                >
                  Make Offer
                </Button>
              )} */}
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
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Button
                          onClick={() => {}}
                          variant="secondary"
                          disabled={isTxPending}
                          className="text-sm font-medium h-8"
                        >
                          List/Auction
                        </Button>
                      </Dialog.Trigger>

                      <Dialog.Content className="max-w-[690px] w-full p-6">
                        <NFTDialog
                          id={id}
                          type="create"
                          nftList={nft}
                          setTimestamp={setEndTimestamp}
                          onClick={handleCreateListing}
                          secondaryOnClick={handleCreateAuction}
                          onChange={setValue}
                          onBuyOutChange={setBuyOutAmount}
                          buyOutValue={buyOutAmount}
                          disabled={isTxPending}
                          value={value}
                          src={imageUrl?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '/logo.svg'}
                          title={nft?.metadata?.name}
                        />
                      </Dialog.Content>
                    </Dialog.Root>
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
  )
}

export default NFTDetailPage
