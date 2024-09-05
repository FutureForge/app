import { Button, Label, Select, TextField } from '@/modules/app'
import { Dialog } from '@/modules/app/component/dialog'
import { client } from '@/utils/configs'
import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import { MediaRenderer } from 'thirdweb/react'

type NFTDialogProps = {
  src: string
  type?: string
  title: string
  filters: TypeFiltersSelection[]
  placeholder: string
  ctaText:string
}
export function NFTDialog(props: NFTDialogProps) {
  const { src, type, title, filters, placeholder, ctaText } = props
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined)

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
  }

  return (
    <div className="w-full flex gap-8 justify-between">
      <div className="!rounded-lg relative w-[230px] h-[230px]">
        <Image
          src={src}
          alt={title}
          layout="fill"
          className="aspect-square absolute inset-0 rounded-lg"
        />
      </div>
      <div className="w-[80%] flex flex-col gap-[30px]">
        <Dialog.Title>
          <h5 className="font-medium text-center">Direct Listing - {title}</h5>
        </Dialog.Title>

        <div className="flex flex-col gap-3">
          <Label htmlFor="amount">Offer Price</Label>
          <TextField
            type="number"
            id="amount"
            placeholder="Amount"
            className="resize-none bg-[#1B1F26B8] placeholder:font-medium"
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-white font-medium text-sm">Duration</p>
          <div className="flex w-full items-center gap-4">
            <FilterSelection
              filter={selectedFilter}
              onChangeFilter={handleFilterChange}
              filters={filters}
              placeholder={placeholder}
            />

            <div className="bg-background border border-dialog-border rounded-xl flex justify-between w-[65%] py-[.625rem] px-2.5">
              <p className="font-medium text-sm">Sep 22, 2024</p>
              <p className="font-medium text-sm">1:43 AM</p>
            </div>
          </div>
        </div>
        <Button variant="secondary" className="h-8">
          {ctaText}
        </Button>
      </div>
    </div>
  )
}

type TypeFiltersSelection = {
  id: string
  title: string
}

type FilterSelectionProps = {
  filter?: string
  onChangeFilter: (value: string) => void
  filters: TypeFiltersSelection[]
  placeholder: string
}

const FilterSelection = ({
  onChangeFilter,
  filter,
  filters,
  placeholder,
}: FilterSelectionProps) => {
  return (
    <Select.Root value={filter} onValueChange={onChangeFilter}>
      <Select.Trigger
        placeholder={placeholder}
        btnClass="bg-background border border-dialog-border w-1/2 font-medium text-sm"
        className="w-1/2"
      />
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

export default FilterSelection
