import express from 'express'

const router = express.Router()

router.get('/:filename', (req, res) => {
  try {
    const gfs = req.app.locals.gfs

    gfs
      .openDownloadStreamByName(req.params.filename)
      .pipe(res)
      .on('error', function (error: any) {
        res.redirect('/')
      })
      .on('finish', function () {
        // console.log("done!");
      })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

export default router
