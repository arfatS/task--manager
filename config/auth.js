module.exports = {
    ensureAuthenticated(req, res, next) {
        if (!req.isAuthenticated()) {
            req.flash('error_msg', 'Please login to continue')
            res.redirect('/users/login')
        }else{
            next()
        }
    },

    checkAuth(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/')
        }else{
            next()
        }
    },

}