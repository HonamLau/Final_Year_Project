const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');

router.get('/userManage',verify, (req,res)=>{
    console.log(req.cookies.authToken);
    res.render('managePower',{name : req.cookies.user, lv: req.cookies.userLevel});
    });

module.exports = router;