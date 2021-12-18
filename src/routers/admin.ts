import express from 'express'
import { isAdmin } from '../middleware/isAdmin'

import {
  findAllAdmin,
  renderCreateProduct,
  createProduct,
  renderEditProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product'

const router = express.Router()

router.use(isAdmin)

router.get('/products', findAllAdmin)

router.get('/products/new', renderCreateProduct)
router.post('/products', createProduct)

router.get('/products/:productId', renderEditProduct)
router.put('/products/:productId', updateProduct)

router.delete('/products/:productId', deleteProduct)

export default router
