module.exports = {

   isLoggedIn: function (req, res, next) {

    if (req.user)
        return next();

    //res.statusCode = 403;
    //res.end('Not authorized');

    res.redirect('/');
}
    ,
    
    isAdmin: function (req, res, next) {

        if (req.user && req.user.role == 'admin')
            return next();

        res.statusCode = 403;
        res.end('Not authorized');
    }


}