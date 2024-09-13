import { useMutation, useQueryClient } from '@tanstack/react-query'
import { owner } from 'thirdweb/extensions/common'
import axios from 'axios'
import { getContractCustom } from '@/modules/blockchain'
import { useUserChainInfo } from '@/modules/query'
import { isERC721 } from 'thirdweb/extensions/erc721'
import { useRouter } from 'next/router'

export async function isNFTContract(contractAddress: string) {
  const contract = await getContractCustom({ contractAddress })
  const result = await isERC721({ contract })
  return result
}

export function useAddCollectionMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({
      collectionContractAddress,
      description,
      name,
      image,
      backgroundImage,
    }: {
      collectionContractAddress: string
      description: string
      name: string
      image: string
      backgroundImage: string
    }) => {
      if (!activeAccount?.address) {
        throw new Error('Wallet not connected')
      }

      const contract = await getContractCustom({
        contractAddress: collectionContractAddress,
      })

      const contractOwner = await owner({
        contract,
      })

      if (contractOwner !== activeAccount?.address) {
        throw new Error('Not the contract owner')
      }

      const signMessage = `I am the owner of the contract ${collectionContractAddress} and want to add a new collection. Sign this message to confirm`

      await activeAccount?.signMessage({ message: signMessage })

      const response = await axios.post('/api/collection', {
        collectionContractAddress,
        description,
        name,
        image,
        backgroundImage,
      })

      if (response.status === 200) {
        router.push(`/collections/${collectionContractAddress}`)
      }

      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      })
    },
    onError: (error) => {},
    meta: {
      successMessage: {
        description: 'Collection added successfully',
      },
      errorMessage: {
        description: 'Failed to add new collection to the marketplace',
      },
    },
  })
}
