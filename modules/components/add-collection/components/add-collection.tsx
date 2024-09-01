import { Button, FileInput, Label, Select, TextArea, TextField, Title } from '@/modules/app'
import React, { useMemo, useState } from 'react'

export function AddCollection() {
  const [filter, setFilter] = useState('latest')

  return (
    <form className="h-[calc(100vh-120px)] w-full flex max-lg:flex-col justify-between max-lg:gap-8 gap-20">
      <div className="flex flex-col gap-8 h-full w-1/2 max-lg:w-full">
        <Title
          title="Add Collection"
          desc="Please make sure you are the owner of the contract address"
        />
        <FileInput />
      </div>
      <div className="w-1/2 h-full flex flex-col max-lg:w-full max-lg:py-8">
        <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="name">Token Name</Label>
              <TextField id="name" placeholder="Name your NFT" />
            </div>
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="contract">Token Contract Address</Label>
              <TextField id="contract" placeholder="Contract Address" />
            </div>
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="description">Description</Label>
              <TextArea id="description" />
            </div>

            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="traits">NFT type</Label>
              <FilterSelection filter={filter} onChangeFilter={setFilter} />
            </div>

            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="traits">Traits</Label>
              <TextArea id="traits" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button variant="secondary" className="h-10 font-medium text-sm font-inter">
            Add to Marketplace
          </Button>
        </div>
      </div>
    </form>
  )
}

type TypeFiltersSelection = {
  id: string
  title: string
}

type FilterSelectionProps = {
  filter?: string
  onChangeFilter: (value: string) => void
}

const FilterSelection = ({ onChangeFilter, filter = 'latest' }: FilterSelectionProps) => {
  const filters = useMemo(() => {
    const filters = [
      { id: 'latest', title: 'Latest' },
      { id: 'trending', title: 'Trending' },
      { id: 'alphabetical', title: 'Alphabetical' },
    ].filter(Boolean)
    return filters as TypeFiltersSelection[]
  }, [])

  return (
    <Select.Root value={filter} onValueChange={onChangeFilter}>
      <Select.Trigger placeholder="Latest" />
      <Select.Content className="data-[state=open]:animate-slideDownAndFade py-1 px-0">
        {filters.map(({ id, title }) => (
          <Select.Item
            key={id}
            value={id}
            className="hover:bg-border-elements/60 dark:hover:bg-primary dark:hover:text-white duration-75 ease-out !rounded-lg px-2 py-1"
          >
            {title}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  )
}
