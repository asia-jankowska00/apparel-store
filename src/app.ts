import express from 'express'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import * as path from 'path'
import sassMiddleware from 'node-sass-middleware'

// Secrets
import { MONGODB_URI } from './utils/secrets'

const app = express()
const mongoUrl = MONGODB_URI

mongoose.Promise = bluebird
mongoose
    .connect(mongoUrl)
    .then(() => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('Its finee')
    })
    .catch((err: Error) => {
        console.log(
            'MongoDB connection error. Please make sure MongoDB is running. ' +
                err
        )
        process.exit(1)
    })

// Express configuration
app.set('port', process.env.PORT || 3000)

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
app.use('/public', express.static(path.join(__dirname, 'public')))

// Configure view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Use common 3rd-party middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// Cross origin enabled
app.use(cors())

app.get('/', (req, res) => {
    res.render('home')
})

export default app
