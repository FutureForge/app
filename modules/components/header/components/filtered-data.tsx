'use Client'
import React from 'react'
import Slider, { Settings } from 'react-slick'
import { ClientOnly } from '@/modules/app'
import { NFTCard } from './nft-card'
import { NewListing, NewAuction } from '../types/types'
import { useMediaQuery } from '@uidotdev/usehooks'

type FilteredContentProps = {
  filteredData: (NewListing | NewAuction)[]
  renderItem: (item: NewListing | NewAuction, index: number) => JSX.Element
  sliderSettings: Settings
}

export function FilteredContent({ filteredData, renderItem, sliderSettings }: FilteredContentProps) {
  const isMobile = useMediaQuery('only screen and (max-width: 600px)')

  return (
    <ClientOnly>
      <div className="max-xsm:mt-5 max-md:px-3">
        {filteredData.length === 0 ? (
          <div className="flex w-full items-center justify-center h-[320px]">
            <p>No data available</p>
          </div>
        ) : (
          <>
            {isMobile && filteredData.length > 1 ? (
              // Show slider on mobile if more than 1 item
              <Slider {...sliderSettings}>{filteredData.map(renderItem)}</Slider>
            ) : filteredData.length > 4 ? (
              // Show slider for larger screens or more than 4 items
              <Slider {...sliderSettings}>{filteredData.map(renderItem)}</Slider>
            ) : (
              // Simple layout for fewer than 2 items on mobile and fewer than 5 on desktop
              <div className="flex mt-8 items-center gap-8 flex-wrap">
                {filteredData.map(renderItem)}
              </div>
            )}
          </>
        )}
      </div>
    </ClientOnly>
  )
}
