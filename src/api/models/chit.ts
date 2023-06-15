import { Schema, Document, model, Model } from "mongoose";

interface IChitDocument extends Document {
  name: string;
  chit_number: string;
  clients: [];
  created: Date;
  amount: number;
  start_date: Date;
  number_of_installments: number;
  installment_amount: number;
}

export interface IChit extends IChitDocument {
  // document level operations
}

const chitSchema = new Schema<IChit>(
  {
    name: { type: String, required: true },
    chit_number: { type: String, required: true },
    clients: { type: [] },
    created: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    start_date: { type: Date, required: true },
    number_of_installments: { type: Number, required: true },
    installment_amount: { type: Number, required: true }
  },
  { strict: true }
).index(
  { chit_number: 1 },
  { unique: true, collation: { locale: "en_US", strength: 1 }, sparse: true }
);

export interface IChitModel extends Model<IChit> {
  // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const Chit: IChitModel = model<IChit, IChitModel>("Chit", chitSchema);

export default Chit;
