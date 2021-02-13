const router = require('express').Router();
const Admin = require('../modal/Admin');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// Admin Register
router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    
    if(error) return res.status(200).json({error : error.details[0].message});

    // Check existing user EMAIL
    const emailExists = await Admin.findOne({email : req.body.email})
    if(emailExists) return res.status(200).json({message : 'Email Alreay Exists!'})


    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(req.body.password, salt)
    // Create New User
    const admin = new Admin({
        name : req.body.name,
        email : req.body.email,
        password: hashedPassword
    });

    try {
        let adminUser = await admin.save();
        res.status(200).json({user : admin._id, message : "Registration Successfull!"});
    }catch(err){
        // console.log(err)
        res.status(200).json({err})
    }
});

// Admin Login
router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    
    if(error) return res.status(200).json({error : error.details[0].message});

    // Check if email exists
    const emailExists = await Admin.findOne({email : req.body.email})
    if(!emailExists) return res.status(200).json({message : 'Email not found!'})
    // Passowrd is correct
    const validPassowrd = await bcrypt.compare(req.body.password, emailExists.password)

    if(!validPassowrd) return res.status(200).json({message : 'Invalid Passowrd!'})

    // Create and assign token
    const token = jwt.sign({_id : emailExists._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).status(200).json({id : emailExists._id,token, email : emailExists.email, name : emailExists.name, role : emailExists.role  })
    return;
    
});

module.exports = router;