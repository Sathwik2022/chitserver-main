import { Schema, Document, model, Model } from "mongoose";

interface IRegionDocument extends Document {
  name: string;
}

export interface IRegion extends IRegionDocument {
  // document level operations
}

const regionSchema = new Schema<IRegion>(
  {
    name: { type: String, required: true },
  },
  { strict: true }
);

export interface IRegionModel extends Model<IRegion> {
  // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const Region: IRegionModel = model<IRegion, IRegionModel>(
  "Region",
  regionSchema
);

export default Region;
