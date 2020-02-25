const express = require('express');
const app = express();
const router = require('express').Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');

const redirectHome = (req,res, next)=>{
    if(req.session.userId){
         res.redirect('/home')
    }
    else
    next()
}

const {registerValidation, loginValidation} =  require('../validation');

// Register user Backend

router.post('/login', async (req,res) => {
    console.log('logging in');
    const {error} =loginValidation(req.body);
    // validation
    if (error){
        console.log('validation error');
        return res.render('login',{validation: error.details[0].message});
    }
    // find user in db
    console.log(req.body.Username);
    console.log(req.body.Password);
    const existedUser = await Users.findOne({
        userName :  req.body.Username
    });
    // no match user
    if (!existedUser){
        console.log('not exist');
        return res.render('login', {error: 'Username or Password is wrong!'});
    }
    const level = await Users.find({userName:req.body.Username},{roleLevel:1});
    const levell = level[0].roleLevel;
    
console.log("Level: "+levell);
    //validating password
    validPassword = await bcrypt.compare(req.body.Password, existedUser.userPassword);
    if(!validPassword){
        console.log('wrong pw');
        return res.render('login', {error: 'Username or Password is wrong!'});
    }
    else{ 
        // create webtoken for login
        const token = jwt.sign({_id: existedUser._id}, process.env.TOKEN_SECRET);
        res.cookie('user',req.body.Username);
        res.cookie('authToken',token);
        res.cookie('userLevel', levell);
        //redirect
        
        res.redirect('../home');
    }
});
router.post('/register', async (req,res) => {
    console.log('register');
    // register validation
    const {error} =registerValidation(req.body);
    if (error){
        console.log('validation error');
        return res.render('register',{validation: error.details[0].message});
    }

    // Find user in Database
    const existedUser = await Users.findOne({
        userName :  req.body.Username
    });
    if (existedUser){
        console.log('exist');
        return res.render('register',{exist :'User already exist !'});
    };

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.Password, salt);

    // Create new user
    const user = new Users({
        userName : req.body.Username,
        userPassword : hashPassword,
        name : req.body.Name,
        roleName : req.body.roleName,
        roleLevel : 1,
        email: req.body.Email
    });    
    
    // Save User
    try{
        const savedUser = await user.save((err)=>{
            if(err){
            console.log('cannot insert');
            console.log(err);
        }
            else
            console.log('data inserted');
        });
        return res.render('register',{success :'Successfully created user !'});
    }catch(err){
        res.status(400).send(err);
    }   

});

router.get('/logout', (req,res) =>{
    res.clearCookie('user');
    res.clearCookie('authToken');
    res.redirect('login');
});
router.get('/register',(req,res)=>{
    // res.render('../src/views/register.ejs');
    res.render('register');
});
router.get('/login',(req,res)=>{
    //res.removeHeader('../src/views/login.ejs');
    res.render('login');
});

router.get('/powerUsed',(req,res)=>{
//need to check if user has logged in
//maybe encrypt and decrypt the username here.
});
router.get('/t',(req,res)=>{
    res.render('adminHome');
})

module.exports = router;