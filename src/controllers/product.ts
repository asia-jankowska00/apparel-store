import { Request, Response, NextFunction } from 'express'
import url from 'url'

import Product, { ProductDocument } from '../models/Product'
import ProductService from '../services/product'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  handleError
} from '../utils/apiError'

// GET /admin/products/new
export const renderCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.render('admin/createProduct')
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// POST /admin/products
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      productCollection,
      categories,
      variants,
      sizes,
      price
    }: ProductDocument = req.body

    const product: ProductDocument = new Product({
      name,
      description,
      productCollection,
      categories,
      variants,
      sizes,
      price,
      image: req.file?.filename
    })

    await ProductService.create(product)

    req.flash('success', 'Successfully made a new product!')
    res.redirect(`/admin/products`)
  } catch (error) {
    console.log(error)
    handleError(error, next)
  }
}

// GET /admin/products/:productId
export const renderEditProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId
    const product = await ProductService.findById(productId)
    if (!product) {
      req.flash('error', 'Cannot find that product!')
      return res.redirect('/admin/products')
    }
    res.render('admin/editProduct', { product })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// PUT /admin/products/:productId
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    req.body.image = req.file?.filename
    const productId = req.params.productId
    console.log(productId)
    console.log(req.body.image)
    await ProductService.update(productId, update)
    return res.redirect('/admin/products')
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// DELTE /admin/products/:productId
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(req.params.productId)
    return res.redirect('/admin/products')
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products/:productId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await ProductService.findById(req.params.productId)
    res.render('product/show', { product })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /products
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = url.parse(req.url, true).query
    const products = await ProductService.findAll(query)

    res.render('home', { products })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// GET /admin/products
export const findAllAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = url.parse(req.url, true).query
    const products = await ProductService.findAll(query)

    res.render('admin/products', { products })
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
