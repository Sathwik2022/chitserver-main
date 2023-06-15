import { Schema, Document, model, Model } from "mongoose";

interface ILoanDocument extends Document {
  loan_number: string;
  amount: number;
  payable: number;
  created: Date;
  issued_date: Date;
  repayment_type: string;
  client: { name: string; id: string };
  region: string;
  agent: { name: string; id: string };
}

export interface ILoan extends ILoanDocument {
  // document level operations
}

const loanSchema = new Schema<ILoan>(
  {
    loan_number: { type: String, required: true },
    amount: { type: Number, required: true },
    payable: { type: Number, required: true },
    created: { type: Date, default: Date.now },
    issued_date: { type: Date, required: true },
    repayment_type: {
      type: String,
      enums: ["daily", "weekly", "monthly"],
      required: true,
    },
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
  },
  { strict: true }
).index(
  { loan_number: 1 },
  { unique: true, collation: { locale: "en_US", strength: 1 }, sparse: true }
);

export interface ILoanModel extends Model<ILoan> {
  // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const Loan: ILoanModel = model<ILoan, ILoanModel>("Loan", loanSchema);

export default Loan;
