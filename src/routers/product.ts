import express from 'express'

import { findById, findAll } from '../controllers/product'

const router = express.Router()

router.get('/', findAll)
router.get('/:productId', findById)

export default router
