const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story.js");

//@desc cription : Show add page
//@route : GET / stories/add
//middleware is add in second argument
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//@desccription : Add form process
//@route : GET / stories
//middleware is add in second argument
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//@desccription : Show all storied
//@route : GET / stories
//middleware is add in second argument
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404')
    } else {
      res.render('stories/show', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


//@desccription : Show edit page
//@route : GET / stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id
  }).lean()

  if (!story) {
    return res.render('error/4040')
  }

  if (story.user != req.user.id){
    res.redirect('/stories')
  }
  else{
    res.render('stories/edit', {
      story,
    })
  }

//@desccription : Update stories
//@route : PUT / stories/:id
//middleware is add in second argument
router.put("/add", ensureAuth, async (req, res) => {

  try {
    let story = await Story.findById(req.params.id).lean()

  if(!story){
    return res.render('error/404')
  }
  if (story.user != req.user.id){
    res.redirect('/stories')
  }
  else{
    story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
      new: true,
      runValidators: true
    })

    res.redirect('/dashboard')
  }
    
  } catch (err) {
    console.error(err)
    return res.render('error/500') 
    
  }

});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
   catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})




});


module.exports = router;
