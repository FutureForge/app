import { useMutation, useQueryClient } from '@tanstack/react-query'
import { owner } from 'thirdweb/extensions/common'
import axios from 'axios'
import { getContractCustom } from '@/modules/blockchain'
import { useUserChainInfo } from '@/modules/query'

export function useAddCollectionMutation() {
  const queryClient = useQueryClient()
  const { activeAccount } = useUserChainInfo()

  return useMutation({
    mutationFn: async (newCollection: {
      collectionContractAddress: string
      name: string
      description: string
      image: string
    }) => {
      const contract = await getContractCustom({
        contractAddress: newCollection.collectionContractAddress,
      })

      const contractOwner = await owner({
        contract,
      })

      if (contractOwner !== activeAccount?.address) {
        throw new Error('You are not the owner of this contract')
      }

      const signMessage = `I am the owner of the contract 0x544C945415066564B0Fb707C7457590c0585e838 and want to add a new collection. Sign this message to confirm`

      await activeAccount?.signMessage({ message: signMessage })

      const response = await axios.post('/api/collection', newCollection)
      return response.data // handle success response
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
