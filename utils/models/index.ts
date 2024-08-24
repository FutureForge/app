// models/Collection.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICollection extends Document {
  collectionContractAddress: string;
  name: string;
  description: string;
  nftType: string;
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
  nftType: {
    type: String,
    required: false,
    enum: ["ERC721", "ERC1155"],
    default: "ERC721",
  },
});

const Collection =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);
export default Collection;
