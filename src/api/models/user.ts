import bcrypt from "bcrypt";
import { Schema, Document, model, Model } from "mongoose";

import validator from "validator";

interface IUserDocument extends Document {
  password: string;
  email: string;
  name: string;
  created: Date;
  type: string;
  contact_number: number;
  region: string;
  address: string;
  pan: string;
  aadhar_number: string;
  date_of_birth: Date;
  photo: string;
  joining_date: string | undefined;
  disabled: boolean | undefined;
  account_number: number;
  witness_1: string;
  contact_number_witness_1: number;
  witness_2: string;
  contact_number_witness_2: number;
}

export interface IUser extends IUserDocument {
  // document level operations
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    password: { type: String, required: true },

    email: {
      type: String,
      required: false,
      trim: true,
      // validate: [validator.isEmail, "do not match email regex"],
    },
    name: { type: String, required: true },
    created: { type: Date, default: Date.now },
    type: {
      type: String,
      enums: ["customer", "agent", "admin"],
      required: true,
    },
    contact_number: { type: Number, required: true, unique: true },
    region: { type: String, required: true },
    address: { type: String, required: true },
    pan: { type: String, required: false },
    aadhar_number: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    photo: { type: String },
    joining_date: { type: String },
    disabled: { type: Boolean },
    account_number: { type: Number, required: false},
    witness_1: { type: String, required: false },
    contact_number_witness_1: { type: Number, required: false },
    witness_2: { type: String, required: false },
    contact_number_witness_2: { type: Number, required: false },
  },
  { strict: true }
).index(
  { email: 1 },
  { unique: true, collation: { locale: "en_US", strength: 1 }, sparse: true }
);

userSchema.pre<IUserDocument>("save", function (next): void {
  if (this.isModified("password")) {
    // generate hash for password
    bcrypt.genSalt(10, (err, salt) => {
      /* istanbul ignore next */
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        /* istanbul ignore next */
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.created = ret.created.getTime();

    delete ret.__v;
    delete ret.password;
  },
});

userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  const { password } = this;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, password, function (err, isMatch) {
      /* istanbul ignore next */
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });
};

export interface IUserModel extends Model<IUser> {
  // collection/docouments level operations (fetch one or many, update, save back to db)
}

export const User: IUserModel = model<IUser, IUserModel>("User", userSchema);

export default User;
