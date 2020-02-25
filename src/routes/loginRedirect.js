const jwt = require('jsonwebtoken');
//for login page redirecting back to home page(if logged in)
module.exports = function(req, res, next){
    const token = req.cookies.authToken;
    if (token) 
    try{    
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.id = verified;
        next(); 
    }catch(err){
        res.status(400).send('Invalid Token');
    }
    else
    {
        res.redirect('./auth/login');
    }
}