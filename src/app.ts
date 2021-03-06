import express from 'express'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import * as path from 'path'
import sassMiddleware from 'node-sass-middleware'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
// import mongoSanitize from 'express-mongo-sanitize'
import methodOverride from 'method-override'
import flash from 'express-flash'

// Secrets
import { MONGODB_URI } from './utils/secrets'

// Routers
import userRouter from './routers/user'
import adminRouter from './routers/admin'
import productRouter from './routers/product'
import fileRouter from './routers/file'
import cartRouter from './routers/cart'

import User from './models/User'

const app = express()
const mongoUrl = MONGODB_URI

mongoose.Promise = bluebird

mongoose
  .connect(mongoUrl, { useUnifiedTopology: true })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    console.log('MongoDB connected')

    const gridFSBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: 'uploads'
      }
    )
    app.locals.gfs = gridFSBucket
  })
  .catch((err: Error) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// app.use(
//   mongoSanitize({
//     replaceWith: '_'
//   })
// )

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = new MongoStore({
  mongoUrl
})

store.on('error', function (e) {
  console.log('Session store error', e)
})

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
// app.use(cookieParser(secret))s
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// Cross origin enabled
app.use(cors())

// Configure SASS
app.use(
  sassMiddleware({
    /* Options */
    src: __dirname,
    dest: path.join(__dirname, 'public/css'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/prefix' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
  })
)

// Configure view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)

app.use(flash())

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// app.get('/', (req, res) => {
//   res.render('home')
// })

// User router
app.use('/', userRouter)

// Cart router
app.use('/cart', cartRouter)

// Product router
app.use('/', productRouter)

// Admin  router
app.use('/admin', adminRouter)

// User router
app.use('/files', fileRouter)

export default app
