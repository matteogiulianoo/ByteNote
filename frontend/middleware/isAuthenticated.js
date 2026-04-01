export function isAuthenticated(req, res, next) {
    if (req.session.email == null) {
        res.redirect('/login')
    } else {
        next()
    }
}