'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { useMarketplaceEventQuery } from '@/modules/query'

export default function Home() {
  const { data: newListingEvent } = useMarketplaceEventQuery()
  const { newListing, newAuction, newSaleListing } = newListingEvent
  console.log({ newListingEvent })

  const [filter, setFilter] = useState<
    'All' | 'Recently Listed' | 'Recently Sold' | 'Recent Auctioned'
  >('All')

  // Filtering logic
  const filteredData = (() => {
    switch (filter) {
      case 'Recently Listed':
        return newListing
      case 'Recently Sold':
        return newSaleListing
      case 'Recent Auctioned':
        return newAuction
      case 'All':
      default:
        return [...(newListing || []), ...(newSaleListing || []), ...(newAuction || [])]
    }
  })()

  return (
    <div className="h-screen md:px-14">
      <Head>
        <title>MintMingle, marketplace for NFTs</title>
        <meta
          name="description"
          content="A community driven token that comes with additional warm gesture, rewards and credit back hampers."
        />
      </Head>

      <div className="flex items-center gap-3">
        {['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned'].map((f) => (
          <button
            key={f}
            className={`px-4 py-1 m-2 rounded-xl hover:text-foreground ${
              filter === f ? 'bg-sec-bg text-foreground' : 'text-muted-foreground'
            } transition ease-in-out duration-200`}
            onClick={() => setFilter(f as any)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}
