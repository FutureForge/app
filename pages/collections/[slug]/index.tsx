import { useGetSingleCollectionQuery } from '@/modules/query'
import { useRouter } from 'next/router'


export default function CollectionPage() {
  const router = useRouter()
  const { contractAddress } = router.query

  const { data, isLoading, error } = useGetSingleCollectionQuery({
    contractAddress: contractAddress as string,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Render your collection page using the data
  return (
    <div>
      <h1>Collection: {data.name}</h1>
      {/* Add more details about the collection */}
    </div>
  )
}
