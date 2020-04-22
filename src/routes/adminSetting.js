const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const Socket =require('../models/Socket');
const url = require('url');

router.get('/configs',verify,(req,res)=>{
    res.render('config',{name : req.cookies.user, lv: req.cookies.userLevel});
});

router.get('/permissionManage', verify, async function(req, res){
    var currentUser = req.cookies.user;
    var level = await Users.find({userName: currentUser},{roleLevel:1});
  
    var abcd = parseInt(level[0].roleLevel);
    if(abcd==null||abcd==undefined||abcd<10){
    res.send("Access denied");
    return;
    }
    const usersList=await Users.find({},{
        userName:1
    });
    var data=[];
    for(var i=0;i<usersList.length;++i){
        var ha = usersList[i].userName;
        if(ha!=undefined &&ha!=null){
            data.push([ha]);
        }
    }   
    res.render('manageLevel',{datas: data, loop: data.length, 
        name: req.cookies.user, lv: req.cookies.userLevel});
}); 

router.get('/updatePermission', verify, async function (req, res) {
    var currentUser = req.cookies.user;
    var level = await Users.find({ userName: currentUser }, { roleLevel: 1 });

    var abcd = parseInt(level[0].roleLevel);
    if (abcd == null || abcd == undefined || abcd < 10) {
        res.send("Access denied");
        return;
    }
    var q = url.parse(req.url, true).query;
    var UN = q.UN;
    var LV = q.LV;
    console.log("user to be changed is " + UN);
    console.log("level granting is " + LV);
    await Users.update({ userName: UN }, { $set: { roleLevel: LV } });
    res.render("succUpPer",{name: req.cookies.user, lv: req.cookies.userLevel});
});

module.exports = router;
