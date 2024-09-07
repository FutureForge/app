import { getContractEthers, waitForTransaction } from '@/modules/blockchain/lib'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upload } from 'thirdweb/storage'
import { client, CROSSFI_MINTER_ADDRESS } from '@/utils/configs'
import { ethers } from 'ethers'
import MinterABI from '@/utils/abi/minterABI.json'
import { useUserChainInfo } from '@/modules/query'
import { useRouter } from 'next/router'
import { useToast } from '@/modules/app/hooks/useToast'

type CreateNFTMetadata = {
  name: string
  description: string
  file: File
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
}

export function useCreateNFTMutation() {
  const toast = useToast()
  const router = useRouter()

  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async (createNFTData: CreateNFTMetadata) => {
      if (!activeAccount) return toast.error('Please connect your wallet')

      const minterContract = await getContractEthers({
        contractAddress: CROSSFI_MINTER_ADDRESS,
        abi: MinterABI,
      })

      const uri = await upload({
        client,
        files: [createNFTData.file!],
        uploadWithoutDirectory: true,
      })

      if (uri) {
        const tokenURI = JSON.stringify({
          name: createNFTData.name,
          description: createNFTData.description,
          image: uri,
          attributes: [
            { trait_type: 'Rarity', value: 'Common' },
            { trait_type: 'Artist', value: 'Mingles' },
          ],
        })
        const transaction = await minterContract.populateTransaction.mint(tokenURI, {
          value: ethers.utils.parseEther('1'),
        })

        // @ts-ignore
        const tx = await activeAccount.sendTransaction(transaction)
        const receipt = await waitForTransaction(tx.transactionHash)

        if (receipt.status === 'reverted') {
          throw new Error('Transaction failed')
        }

        const totalSupply = await minterContract.totalSupply()
        const tokenId = totalSupply.toString() - 1

        await router.push(`/nft/${CROSSFI_MINTER_ADDRESS}/CFC-721/${tokenId}`)

        return receipt
      } else {
        throw new Error('No URI')
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['userNFTs', 'profile'],
      })
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: 'NFT Created successfully',
      },
      errorMessage: {
        description: 'Failed to create nft',
      },
    },
  })
}
