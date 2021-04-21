//auth middleware = function that can access to req res object
module.exports = {
    //next : funciton after done exerything we done
    ensureAuth: function (req, res, next) {
        if(req.isAuthenticated()) {
            //move on
            return next()
        } else {
            res.redirect('/')
        }
    },
    //for if want to go login page when logged
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}