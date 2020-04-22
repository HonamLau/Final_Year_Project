const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Usersss = require('./models/Users');
const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
const Socket =require('../models/Socket');
const WaitingSock =require('../models/WaitingSock');
const url = require('url');

router.get('/officeManage',verify,(req,res)=>{
    res.render('manageOffice',{name : req.cookies.user, lv: req.cookies.userLevel});
});

router.get("/addSocket", verify, async (req, res) => {
  var waitList = await WaitingSock.find({});
  res.render("addDevices", {
    name: req.cookies.user,
    lv: req.cookies.userLevel,
    waitList: waitList
  });
});

router.get("/assignToSocket", verify, async function (req, res) {
  var currentUser = req.cookies.user;
  var level = await Users.find({ userName: currentUser }, { roleLevel: 1 });

  var abcd = parseInt(level[0].roleLevel);
  if (abcd == null || abcd == undefined || abcd < 5) {
    res.send("Access denied");
    return;
  }

  const socketList = await Socket.find({ userName: null }, { socketID: 1 });
  var socketData = [];
  for (var i = 0; i < socketList.length; ++i) {
    socketData.push(socketList[i].socketID);
  }

  const fullSocketList = await Socket.find({}, { socketID: 1, userName: 1 });

  var fullData = [];
  var halfData = [];
  //if that socket has an owner
  for (var i = 0; i < fullSocketList.length; ++i) {
    if (
      fullSocketList[i].userName != null &&
      fullSocketList[i].userName != ""
    ) {
      fullData.push([fullSocketList[i].socketID, fullSocketList[i].userName]);
      halfData.push(fullSocketList[i].userName);
    }
  }

  const userList = await Users.find({}, { userName: 1 });
  var userData = [];
  for (var i = 0; i < userList.length; ++i) {
    if (userList[i].userName != null && userList[i].userName != undefined)
      userData.push(userList[i].userName);
  }
  res.render("assignToSocket", {
    userDatas: userData,
    socketDatas: socketData,
    iteration1: userData.length,
    iteration2: socketData.length,
    fullDatas: fullData,
    iteration3: fullData.length,
    halfDatas: halfData,
    iteration4: halfData.length,
    name : req.cookies.user, 
    lv: req.cookies.userLevel
  });
});

//after clicking the button remove
router.get('/removeFromSocket',verify, async function (req, res) {
    var currentUser = req.cookies.user;
    var level = await Users.find({ userName: currentUser }, { roleLevel: 1 });

    var abcd = parseInt(level[0].roleLevel);
    if (abcd == null || abcd == undefined || abcd < 5) {
        res.send("Access denied");
        return;
    }

    var q = url.parse(req.url, true).query;
    var UN = q.UN;
    var sId = q.sId;
    await Socket.update({ socketID: sId }, { $set: { userName: null } });

    res.render("succUpPer",{name : req.cookies.user, lv: req.cookies.userLevel });
});

//after clicking the button for assignToSocket.ejs
router.get('/assignSocket',verify, async function(req,res){
    var currentUser = req.cookies.user;
    var level = await Users.find({userName: currentUser},{roleLevel:1});
    
    var abcd = parseInt(level[0].roleLevel);
    if(abcd==null||abcd==undefined||abcd<5){
    res.send("Access denied");
    return;
    }

    var q = url.parse(req.url,true).query;
    var UN = q.UN;
    var sId = q.sId;

    const temp = await Socket.find({userName: UN},{socketID:sId});
    if(temp[0]!=undefined)
    if(temp[0].socketID!=null){
    console.log("HAPPY!!!!!!");
    await Socket.update({socketID: temp[0].socketID},{$set:{userName: null}});
    }
    await Socket.update({socketID: sId},{$set:{userName: UN}});

    res.render("succUpPer",{name : req.cookies.user, lv: req.cookies.userLevel});
});

module.exports = router;