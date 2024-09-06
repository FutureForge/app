import { Button, FileInput, Label, TextArea, TextField, Title } from '@/modules/app'
import { useToast } from '@/modules/app/hooks/useToast'
import { useCreateNFTMutation } from '@/modules/mutation'
import React, { useEffect, useState } from 'react'

type Trait = {
  trait_type: string
  value: string
}

export function CreateNFT() {
  const toast = useToast()
  const createNFTMutation = useCreateNFTMutation()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [traits, setTraits] = useState<Trait[]>([])
  const [fileInputKey, setFileInputKey] = useState(() => Date.now().toString())

  const handleAddTrait = () => {
    setTraits([...traits, { trait_type: '', value: '' }])
  }

  const handleTraitChange = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newTraits = [...traits]
    newTraits[index][field] = value
    setTraits(newTraits)
  }

  const handleRemoveTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setFile(null)
    setTraits([])
    setFileInputKey(Date.now().toString())
  }

  const handleCreateNFT = async () => {
    if (!name || !description || !file) return toast.error('Please fill out all fields')

    createNFTMutation.mutate(
      {
        name,
        description,
        file,
        attributes: traits,
      },
      {
        onSuccess: () => {
          resetForm()
        },
        onError: () => {
          resetForm()
        },
      },
    )
  }

  useEffect(() => {
    if (createNFTMutation.isPending) {
      toast.error('Creating NFT...')
    }
  }, [createNFTMutation.isPending])

  return (
    <div className="h-[calc(100vh-120px)] w-full flex max-lg:flex-col container mx-auto justify-between max-lg:gap-8 gap-20">
      <div className="flex flex-col gap-8 h-full w-1/2 max-lg:w-full">
        <Title
          title="Create an NFT"
          desc="Once your item is minted you will not be able to change any of its information."
        />
        <FileInput
          key={fileInputKey}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) {
              setFile(selectedFile)
            }
          }}
        />
      </div>
      <div className="w-1/2 h-full flex flex-col max-lg:w-full max-lg:py-8">
        <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
          <div className="w-full flex flex-col gap-10">
            <div className="flex flex-col gap-2 min-[1720px]:gap-3">
              <Label htmlFor="name">Token Name</Label>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                placeholder="Name your NFT"
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
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 min-[1720px]:gap-3">
                <Label htmlFor="traits">Traits</Label>
                {traits.map((trait, index) => (
                  <div key={index} className="flex gap-2">
                    <TextField
                      value={trait.trait_type}
                      onChange={(e) => handleTraitChange(index, 'trait_type', e.target.value)}
                      placeholder="Trait Type"
                    />
                    <TextField
                      value={trait.value}
                      onChange={(e) => handleTraitChange(index, 'value', e.target.value)}
                      placeholder="Value"
                    />
                    <Button onClick={() => handleRemoveTrait(index)} variant="secondary">
                      Remove
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddTrait} variant="primary">
                  Add Trait
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            onClick={handleCreateNFT}
            disabled={createNFTMutation.isPending}
            variant="secondary"
            className="h-10 font-medium text-sm font-inter"
          >
            Create NFT
          </Button>
        </div>
      </div>
    </div>
  )
}
