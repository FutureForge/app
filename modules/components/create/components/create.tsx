import { Button, FileInput, Label, TextArea, TextField, Title } from '@/modules/app'
import React from 'react'

export function CreateNFT() {
  return (
    <form className="h-[calc(100vh-120px)] w-full flex max-lg:flex-col justify-between max-lg:gap-8 gap-20">
      <div className="flex flex-col gap-8 h-full w-1/2 max-lg:w-full">
        <Title
          title="Create an NFT"
          desc="Once your item is minted you will not be able to change any of its information."
        />
        <FileInput />
      </div>
      <div className="w-1/2 h-full flex flex-col max-lg:w-full max-lg:py-8">
        <div className="lg:overflow-y-auto flex-grow px-1">
          <div className="w-full flex flex-col gap-10">
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
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 min-[1720px]:gap-3">
                <Label htmlFor="traits">Traits</Label>
                <TextArea id="traits" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {['Direct Listing', 'Auction'].map((item) => (
            <Button variant="secondary" className="h-10 font-medium text-sm font-inter" key={item}>
              {item}
            </Button>
          ))}
        </div>
      </div>
    </form>
  )
}
