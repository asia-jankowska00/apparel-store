import express from 'express'

import {
  getCart,
  manageProductInCart,
  removeProductInCart
} from '../controllers/cart'

const router = express.Router()

router.get('/', getCart)

router.post('/:productId', manageProductInCart)

router.delete('/:productId', removeProductInCart)

export default router
