import mongoose, { Document, Schema } from 'mongoose'
import { ObjectId } from 'mongodb'

export interface ICollection {
  _id?: ObjectId
  collectionContractAddress: string
  name: string
  description: string
  image: string
  createdAt: Date
  backgroundImage: string
}

const CollectionSchema = new Schema<ICollection>({
  collectionContractAddress: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: false,
    maxLength: 500,
  },
  image: {
    type: String,
    required: false,
  },
  backgroundImage: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Collection =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema)
export default Collection
