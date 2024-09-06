import { Button, Icon, Label, Select, TextArea, TextField, Title } from '@/modules/app'
import { useAddCollectionMutation } from '@/modules/mutation'
import {
  CldUploadWidget,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useCheckIfItsACollectionQuery, useFetchCollectionsQuery } from '@/modules/query'
import { ICollection } from '@/utils/models'
import { useToast } from '@/modules/app/hooks/useToast'

export function AddCollection() {
  const toast = useToast()
  const addCollectionMutation = useAddCollectionMutation()
  const { data: collections } = useFetchCollectionsQuery()

  const [description, setDescription] = useState('')
  const [collectionContractAddress, setCollectionContractAddress] = useState('')
  const [nftName, setNFTName] = useState('')
  const [collectionExist, setCollectionExist] = useState(false)

  const { data: collectionInfo } = useCheckIfItsACollectionQuery(collectionContractAddress)

  const [error, setError] = useState<string | null | CloudinaryUploadWidgetError>(null)
  const [filter, setFilter] = useState('cfc721')
  const [imageUrl, setImageUrl] = useState<string | CloudinaryUploadWidgetInfo | undefined>()
  const secureUrl = imageUrl ? (imageUrl as CloudinaryUploadWidgetInfo).secure_url : undefined

  const handleAddToMarketplace = async () => {
    if (!imageUrl) return alert('Please upload an image')
    const { secure_url } = imageUrl as CloudinaryUploadWidgetInfo
    addCollectionMutation.mutate(
      {
        collectionContractAddress: collectionContractAddress,
        description: description,
        name: nftName,
        image: secure_url,
      },
      {
        onSuccess: () => {
          setNFTName('')
          setCollectionContractAddress('')
          setDescription('')
          setImageUrl(undefined)
        },
        onError: () => {
          setNFTName('')
          setCollectionContractAddress('')
          setDescription('')
          setImageUrl(undefined)
        },
      },
    )
  }

  useEffect(() => {
    setNFTName(collectionInfo?.nftData?.[0]?.name)
  }, [collectionInfo])

  useEffect(() => {
    if (addCollectionMutation.isPending) {
      toast.loading('Adding Collection To Marketplace.....')
    }
  }, [addCollectionMutation.isPending])

  useEffect(() => {
    if (collections) {
      const collectionExist = collections.some(
        (collection: ICollection) =>
          collection.collectionContractAddress === collectionContractAddress,
      )
      setCollectionExist(collectionExist)
    }
  }, [collections, collectionContractAddress])

  return (
    <div className="h-[calc(100vh-120px)] w-full flex max-lg:flex-col justify-between max-lg:gap-8 gap-20">
      <div className="flex flex-col gap-8 h-full w-1/2 max-lg:w-full">
        <Title
          title="Add Collection"
          desc="Please make sure you are the owner of the contract address"
        />
        {/* <FileInput /> */}
        <CldUploadWidget
          options={{ sources: ['local'] }}
          onSuccess={(result, { widget }) => {
            setImageUrl(result?.info)
            widget.close()
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close()
          }}
          onError={(error, { widget }) => {
            setError(error)
            widget.close()
          }}
          uploadPreset="mint-mingles-collection"
        >
          {({ open }) => {
            function handleOnClick() {
              setImageUrl(undefined)
              open()
            }
            // return <button onClick={handleOnClick}>Upload an Image</button>
            return (
              <>
                <div
                  onClick={handleOnClick}
                  className="flex w-full h-full items-center relative text-center bg-sec-bg justify-center cursor-pointer rounded-2xl"
                >
                  {secureUrl ? (
                    <Image
                      src={secureUrl}
                      alt="Uploaded file"
                      layout="fill"
                      className="absolute inset-0 rounded-xl border border-sec-bg"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-6 py-8">
                      <Icon iconType={'download'} className="w-20 max-md:w-10" />
                      <div className="flex flex-col gap-4">
                        <p className="font-medium text-muted-foreground">Drag and drop media</p>
                        <p>Browse Files</p>
                        <span>
                          <p className="text-sm text-muted-foreground">Max size: 50MB</p>
                          <p className="text-sm text-muted-foreground">JPG, PNG, GIF, SVG, MP4</p>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {error && <p style={{ color: 'red' }}>{error.toString()}</p>}
              </>
            )
          }}
        </CldUploadWidget>
      </div>
      <div className="w-1/2 h-full flex flex-col max-lg:w-full max-lg:py-8">
        <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="contract">Token Contract Address</Label>
              <TextField
                value={collectionContractAddress}
                onChange={(e) => setCollectionContractAddress(e.target.value)}
                id="contract"
                placeholder="Contract Address"
              />
              {collectionContractAddress && collectionInfo && !collectionInfo.isCFC721 && (
                <p style={{ color: 'red' }}>Not a Valid CFC-721 token</p>
              )}
              {collectionContractAddress && collectionExist && (
                <p style={{ color: 'red' }}>Collection already in Marketplace</p>
              )}
            </div>
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="name">Collection Name</Label>
              <TextField
                value={nftName || collectionInfo?.nftData?.[0]?.name || ''}
                onChange={(e) => setNFTName(e.target.value)}
                id="name"
                placeholder="Name of your Collection"
              />
            </div>
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="description">Description</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
              />
            </div>

            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="traits">NFT type</Label>
              <FilterSelection filter={filter} onChangeFilter={setFilter} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            onClick={handleAddToMarketplace}
            disabled={
              addCollectionMutation?.isPending ||
              !nftName ||
              !description ||
              !secureUrl ||
              !collectionContractAddress ||
              !collectionInfo?.isCFC721 ||
              collectionExist
            }
            variant="secondary"
            className="h-10 font-medium text-sm font-inter"
          >
            Add to Marketplace
          </Button>
        </div>
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
}

const FilterSelection = ({ onChangeFilter, filter = 'cfc721' }: FilterSelectionProps) => {
  const filters = useMemo(() => {
    const filters = [{ id: 'cfc21', title: 'CFC721' }].filter(Boolean)
    return filters as TypeFiltersSelection[]
  }, [])

  return (
    <Select.Root value={filter} onValueChange={onChangeFilter}>
      <Select.Trigger placeholder="CFC721" />
      <Select.Content className="data-[state=open]:animate-slideDownAndFade py-1 px-0">
        {filters.map(({ id, title }) => (
          <Select.Item
            disabled
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
