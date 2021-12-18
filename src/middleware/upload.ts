import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage'
import crypto from 'crypto'
import path from 'path'
import { Request } from 'express'
import { MONGODB_URI } from '../utils/secrets'

const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (req: Request, file: File) => {
    return new Promise((resolve, reject) => {
      try {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          // eslint-disable-next-line
          //@ts-ignore
          const filename = buf.toString('hex') + path.extname(file.originalname)
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          }
          resolve(fileInfo)
        })
      } catch (error) {
        console.log(error)
      }
    })
  }
})

export const upload = multer({ storage })
