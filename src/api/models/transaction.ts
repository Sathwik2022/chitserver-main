import { Schema, Document, model, Model } from "mongoose";

interface ITransactionDocument extends Document {
  transaction_number: string;
  client: { name: string; id: string };
  region: string;
  agent: { name: string; id: string };
  created: Date;
  received_amount: number;
  received_date: Date;
  type: string;
  transaction_type: string | undefined;
  settlement: boolean;
  transaction_for: string;
}

export interface ITransaction extends ITransactionDocument {
  // document level operations
}

const transactionSchema = new Schema<ITransaction>(
  {
    transaction_number: { type: String, required: true },
    transaction_for: { type: String },
    client: {
      type: {
        name: { type: String, required: true },
        id: { type: String, required: true },
      },
    },
    region: { type: String, required: true },
    agent: {
      type: {
        name: { type: String, required: true },
        id: { type: String, required: true },
      },
    },
    created: { type: Date, default: Date.now },
    received_amount: { type: Number, required: true },
    received_date: { type: Date, required: true },
    type: { type: String, enums: ["loan", "chit"], required: true },
    transaction_type: { type: String },
    settlement: {type: Boolean, default: false},
  },
  { strict: true }
).index({ created: 1 });

export interface ITransactionModel extends Model<ITransaction> {
  // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const Transaction: ITransactionModel = model<
  ITransaction,
  ITransactionModel
>("Transaction", transactionSchema);

export default Transaction;
