const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');

router.get('/officeManage',verify,(req,res)=>{
    res.render('manageOffice',{name : req.cookies.user, lv: req.cookies.userLevel});
});

module.exports = router;