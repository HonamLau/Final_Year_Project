const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    const level = req.cookies.userLevel;
    if (!level) return res.status(401).send('Access Denied');

    try{    
        if(parseInt(level)>5)
        next();
        else
        throw err;
    }catch(err){
        res.status(400).send('Invalid Token');
    }
}