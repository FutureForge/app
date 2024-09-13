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
import { isNFTContract } from '@/modules/mutation/collection'

export function AddCollection() {
  const toast = useToast()
  const addCollectionMutation = useAddCollectionMutation()
  const { data: collections } = useFetchCollectionsQuery()

  const [description, setDescription] = useState('')
  const [collectionContractAddress, setCollectionContractAddress] = useState('')
  const [nftName, setNFTName] = useState('')
  const [NFTContract, setNFTContract] = useState<boolean>()
  const [collectionExist, setCollectionExist] = useState<boolean>()

  const { data: collectionInfo } = useCheckIfItsACollectionQuery(collectionContractAddress)

  const [error, setError] = useState<string | null | CloudinaryUploadWidgetError>(null)
  const [imageUrl, setImageUrl] = useState<string | CloudinaryUploadWidgetInfo | undefined>()
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<
    string | CloudinaryUploadWidgetInfo | undefined
  >()
  const secureUrl = imageUrl ? (imageUrl as CloudinaryUploadWidgetInfo).secure_url : undefined

  const handleAddToMarketplace = async () => {
    if (!imageUrl) return alert('Please upload an image')
    if (!backgroundImageUrl) return alert('Please upload an image')

    const { secure_url } = imageUrl as CloudinaryUploadWidgetInfo
    const { secure_url: backgroundSecureUrl } = backgroundImageUrl as CloudinaryUploadWidgetInfo

    addCollectionMutation.mutate(
      {
        collectionContractAddress: collectionContractAddress,
        description: description,
        name: nftName,
        image: secure_url,
        backgroundImage: backgroundSecureUrl,
      },
      {
        onSuccess: () => {
          setNFTName('')
          setCollectionContractAddress('')
          setDescription('')
          setImageUrl(undefined)
          setBackgroundImageUrl(undefined)
        },
        onError: () => {
          setNFTName('')
          setCollectionContractAddress('')
          setDescription('')
          setImageUrl(undefined)
          setBackgroundImageUrl(undefined)
        },
      },
    )
  }

  useEffect(() => {
    setNFTName(collectionInfo?.nftData?.[0]?.name)
  }, [collectionInfo])

  useEffect(() => {
    const showToast = async () => {
      if (addCollectionMutation.isPending) {
        await toast.loading('Adding Collection To Marketplace.....')
      }
    }

    showToast()
  }, [addCollectionMutation.isPending, toast])

  useEffect(() => {
    if (collections) {
      const collectionExist = collections.some(
        (collection: ICollection) =>
          collection.collectionContractAddress === collectionContractAddress,
      )
      setCollectionExist(collectionExist)
    }
  }, [collections, collectionContractAddress])

  useEffect(() => {
    const checkIfNFT721Contract = async () => {
      if (collectionContractAddress) {
        const result = await isNFTContract(collectionContractAddress)
        console.log('result', result)
        setNFTContract(result)
      }
    }
    checkIfNFT721Contract()
  }, [collectionContractAddress])

  return (
    <div className="h-[calc(100vh-120px)] w-full flex max-lg:flex-col justify-between max-lg:gap-8 gap-20">
      <div className="flex flex-col gap-8 h-full w-1/2 max-lg:w-full">
        <Title
          title="Add Collection"
          desc="Please make sure you are the owner of the contract address"
        />

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Collection Image</h3>
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
              return (
                <>
                  <div
                    onClick={handleOnClick}
                    className="flex w-full h-64 items-center relative text-center bg-sec-bg justify-center cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    {secureUrl ? (
                      <Image
                        src={secureUrl}
                        alt="Uploaded file"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Icon iconType={'download'} className="w-12 h-12 text-gray-400" />
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-gray-600">Click to upload image</p>
                          <p className="text-sm text-gray-400">JPG, PNG, GIF, SVG (max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-500 mt-2">{error.toString()}</p>}
                </>
              )
            }}
          </CldUploadWidget>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Background Image</h3>
          <CldUploadWidget
            options={{ sources: ['local'] }}
            onSuccess={(result, { widget }) => {
              setBackgroundImageUrl(result?.info)
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
                setBackgroundImageUrl(undefined)
                open()
              }
              return (
                <>
                  <div
                    onClick={handleOnClick}
                    className="flex w-full h-64 items-center relative text-center bg-sec-bg justify-center cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    {backgroundImageUrl ? (
                      <Image
                        src={(backgroundImageUrl as CloudinaryUploadWidgetInfo).secure_url}
                        alt="Uploaded background"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Icon iconType={'download'} className="w-12 h-12 text-gray-400" />
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-gray-600">Click to upload background</p>
                          <p className="text-sm text-gray-400">JPG, PNG, GIF, SVG (max 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-500 mt-2">{error.toString()}</p>}
                </>
              )
            }}
          </CldUploadWidget>
        </div>
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
              {collectionContractAddress && !NFTContract && (
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
              !NFTContract ||
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
