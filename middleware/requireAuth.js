module.exports = function requireAuth(req,res,next) {
    if(req.isAuthenticated()) return next();
    return res.redirect("/login");
}