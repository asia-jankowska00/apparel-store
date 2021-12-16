import mongoose, { Document, PassportLocalSchema } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

export type UserDocument = Document & {
  isAdmin: boolean
  username: string
  firstName: string
  lastName: string
  email: string
  cart: { product: mongoose.Types.ObjectId; quantity: number }[]
}

export const userSchema = new mongoose.Schema({
  isAdmin: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ]
}) as PassportLocalSchema

userSchema.plugin(passportLocalMongoose)

export default mongoose.model<UserDocument>('User', userSchema)
