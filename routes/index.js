const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')


const Story = require('../models/Story.js')


//@desc cription : login/Landing page
//@route : GET / 
//middleware is add in second argument
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
      layout: 'login',
    })
  })

//@desc cription Dashboard
//@route : GET / dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({ user: req.user.id }).lean()
      res.render('dashboard', {
        name: req.user.firstName,
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })
  
  module.exports = router