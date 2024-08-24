// models/Collection.ts
import mongoose, { Document, Schema } from "mongoose";

interface ICollection extends Document {
  collectionContractAddress: string;
  name: string;
  description: string;
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
});

const Collection =
  mongoose.models.Collection ||
  mongoose.model<ICollection>("Collection", CollectionSchema);
export default Collection;
