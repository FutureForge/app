import { FilterButtons } from '@/modules/components/header/components/filter'
import { Header } from '@/modules/components/profile'
import { useGetSingleCollectionQuery } from '@/modules/query'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function CollectionPage() {
  const router = useRouter()
  const { contractAddress } = router.query

  const { data:singleCollection, isLoading, error } = useGetSingleCollectionQuery({
    contractAddress: contractAddress as string,
  })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Render your collection page using the data
  return (
    <div className="md:px-14 px-4">
      <Header />
      <div className="lg:ml-52 z-50 max-md:mt-10 max-w-[90%]">
        <FilterButton />
      </div>
      <h1>Collection: {singleCollection.name}</h1>
      {/* Add more details about the collection */}
    </div>
  )
}

type FilterType = 'Items' | 'Offers'

const filters: FilterType[] = ['Items', 'Offers']
function FilterButton() {
  const [filter, setFilter] = useState<FilterType>('Items')
  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} filters={filters} />
    </div>
  )
}
