const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    const token = req.header('auth-token');

    if(!token){
        return res.status(200).json({message : 'Access Denied!'})
    }

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.admin = verified;
        next();
    } catch(err){
        res.status(200).json({error : 'Invalid Token'})
    }
}