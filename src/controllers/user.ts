import { Request, Response, NextFunction } from 'express'

import User from '../models/User'

// GET /register
export const renderRegister = (req: Request, res: Response) => {
  res.render('user/register')
}

// POST /register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, firstName, lastName, username, password } = req.body
    const user = new User({ email, firstName, lastName, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, (err) => {
      if (err) return next(err)
      res.redirect('/')
    })
  } catch (error) {
    req.flash('error', error.message)
    res.redirect('/register')
  }
}

// GET /login
export const renderLogin = (req: Request, res: Response) => {
  res.render('user/login')
}

// POST /login
export const login = async (req: Request, res: Response) => {
  res.redirect('/')
}

export const logout = async (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}
