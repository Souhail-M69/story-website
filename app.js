const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
//use session middlware, function to work
const MongoStore = require('connect-mongo')
const connectDb = require('./config/db')
const { appendFile } = require('fs')
const { Mongoose } = require('mongoose')




//load config file
dotenv.config({path: './config/config.env'})



// Passport config 
require('./config/passport')(passport)

//Connect DB
connectDb()

//initialise app
const app = express()


app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


//Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//when request show in the console
//run only in devlopment mode
if(process.env.NODE_ENV === 'development'){
    //morgan middleware
    app.use(morgan('dev'))
}


//Handlebars helper
const {formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


//handle bars setup view engine and use hbs extension
//a layout wrap everything in differents view
//default layout = main

app.engine('.hbs', exphbs({helpers: 
    {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select

},defaultLayout: 'main', extname: '.hbs'}));

app.set('view engine', 'hbs');

// Session 
app.use(session({
    secret: 'story book',
    //dont save session if nothing change
    resave: false,
    //dont create session until something stored
    saveUninitialized: false,
    //store session in db to not disconnect after changes
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://souhail:Comptesouhail69@cluster0.cq7f2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' })
}))


//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set Globar var
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


//process.env = use variable in config
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))  

