import express from 'express'
import passport from 'passport'

import {
  register,
  login,
  renderRegister,
  renderLogin,
  logout
} from '../controllers/user'

const router = express.Router()

router.get('/register', renderRegister)
router.post('/register', (req, res, next) => {
  register(req, res, next).catch(next)
})

router.get('/login', renderLogin)
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  login
)

router.get('/logout', logout)

export default router
