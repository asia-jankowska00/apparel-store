import mongoose, { Document } from 'mongoose'

export type ProductCollection = 'Man' | 'Woman' | 'Kids'

export type ProductCategories =
  | 'T-shirts'
  | 'Sweaters'
  | 'Jackets'
  | 'Pants'
  | 'Shoes'

export type ProductDocument = Document & {
  name: string
  description: string
  productCollection: ProductCollection
  categories: ProductCategories[]
  variants: string[]
  sizes: string[]
  price: number
  image: string
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true },
    uppercase: true
  },
  description: String,
  productCollection: String,
  categories: [String],
  variants: [String],
  sizes: {
    type: Array,
    default: ['XS', 'S', 'M', 'L', 'XL']
  },
  price: Number,
  image: String
})

export default mongoose.model<ProductDocument>('Product', productSchema)
