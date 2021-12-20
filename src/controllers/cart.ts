import { Request, Response, NextFunction } from 'express'
import CartService from '../services/cart'
import { UserDocument } from '../models/User'
import { NotFoundError } from '../utils/apiError'

interface RequestWithUser extends Request {
  user: UserDocument
}

// GET /cart
export const getCart = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: UserDocument = await CartService.getCart(req.user._id)
    res.render('user/cart', { cart: user.cart })
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}

// PUT /cart
export const manageProductInCart = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id
    const productId = req.params.productId
    const isIncreased = req.body.isIncreased
    if (isIncreased) {
      await CartService.addProductToCart(productId, userId)
      res.redirect('/cart')
    } else {
      await CartService.decreaseQuantityOfProduct(productId, userId)
      res.redirect('/cart')
    }
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}

// DELETE /cart
export const removeProductInCart = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id
    const productId = req.params.productId
    await CartService.removeProductInCart(productId, userId)
    res.redirect('/cart')
  } catch (error) {
    next(new NotFoundError('Product not found', error))
  }
}
