const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');


router.get('/usage',verify,(req,res)=>{
    res.render('stats');
})
    
module.exports = router;