import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../utils/apiError'
import User, { UserDocument } from '../models/User'

interface ReqUser extends Request {
  user: UserDocument
}

export const isAdmin = async (
  req: ReqUser,
  res: Response,
  next: NextFunction
) => {
  const currentUser = await User.findById(req.user._id).exec()
  if (currentUser.isAdmin) {
    req.user.isAdmin = true
    next()
  } else
    next(
      new ForbiddenError(`You don't have the rights to access this resource`)
    )
}
