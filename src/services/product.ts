import Product, { ProductDocument } from '../models/Product'

function create(product: ProductDocument): Promise<ProductDocument> {
  return product.save()
}

function findById(productId: string): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec() // .exec() will return a true Promise
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }
      return product
    })
}

function findAll(query: any): Promise<ProductDocument[]> {
  // return Product.find({}).exec()
  const findObject: any = {
    // name: new RegExp(query.name, 'i'),
    // Should be a dropdown categories in the UI
    // This $all can catch all of the categories insde query.category array
    // variants: new RegExp(query.variant, 'i')
  }
  if (query.productCollection)
    findObject.productCollection = { $all: query.productCollection }
  return (
    Product.find(findObject)
      .sort({ name: 1, price: -1 })
      // .limit(parseInt(query.limit))
      .exec()
  ) // Return a Promise
}

function update(
  productId: string,
  update: Partial<ProductDocument>
): Promise<ProductDocument> {
  return Product.findById(productId)
    .exec()
    .then((product) => {
      if (!product) {
        throw new Error(`Product ${productId} not found`)
      }

      if (update.name) {
        product.name = update.name
      }

      if (update.price) {
        product.price = update.price
      }

      if (update.image) {
        product.image = update.image
      }

      return product.save()
    })
}

function deleteProduct(productId: string): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(productId).exec()
}

export default {
  create,
  update,
  deleteProduct,
  findById,
  findAll
}
