const router = require('express').Router();
const User = require('../modal/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
router.get('/', authAdmin ,(req, res, next) => {
    res.status(200).json({
        posts: {
            title : "Private Route : Login & Register Employees",
            description : "Private Data you shouldn't access!"
        }
    })
});

// Register New User
router.post('/create-user', authAdmin, async(req,res,next) => {
    const { error } = registerValidation(req.body);

    if(error) return res.status(200).json({error : error.details[0].message});
    // Check existing user EMAIL
    const emailExists = await User.findOne({email : req.body.email})
    if(emailExists) return res.status(200).json({message : 'Email Alreay Exists!'})

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(req.body.password, salt)

    // Create New User
    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password: hashedPassword
    });
    try {
        let userUser = await user.save();
        res.status(200).json({user : user._id, message : "Registration Successfull!"});
    }catch(err){
        // console.log(err)
        res.status(200).json({err})
    }
})

// Login
// Admin Login
router.post('/login-user', async(req, res) => {
    const { error } = loginValidation(req.body);
    
    if(error) return res.status(200).json({error : error.details[0].message});

    // Check if email exists
    const emailExists = await User.findOne({email : req.body.email})
    if(!emailExists) return res.status(200).json({message : 'Email not found!'})
    // Passowrd is correct
    const validPassowrd = await bcrypt.compare(req.body.password, emailExists.password)

    if(!validPassowrd) return res.status(200).json({message : 'Invalid Passowrd!'})

    // Create and assign token
    const token = jwt.sign({_id : emailExists._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).status(200).json({id : emailExists._id,token, email : emailExists.email, name : emailExists.name, role : emailExists.role  })
    return;
    
});

function authAdmin(req, res, next){
    const token = req.header('auth-token');
    const role = req.header('role');
    // console.trace(token, role)
    if(!token){
        return res.status(200).json({message : 'Access Denied!'})
    }
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(200).json({error : 'Invalid Token'})
    }
    
}

module.exports = router;