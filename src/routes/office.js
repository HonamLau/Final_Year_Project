const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Usersss = require('./models/Users');
const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
const Socket =require('../models/Socket');
const EnUse = require('../models/EnergyUse')
const daily = require('../models/dailyUsage');
const WaitingSock =require('../models/WaitingSock');
const url = require('url');
const plan = require('../models/PowerPlan')

router.get('/officeManage',verify, async(req,res)=>{
    var socketList = await Socket.find({
    });
    res.render('manageOffice',{name : req.cookies.user, lv: req.cookies.userLevel, socketList:socketList});
});

router.get("/addSocket", verify, async (req, res) => {
  var waitList = await WaitingSock.find({});
  res.render("addDevices", {
    name: req.cookies.user,
    lv: req.cookies.userLevel,
    waitList: waitList
  });
});

router.post("/addSocket", verify, async (req, res) => {
  console.log("MAC ", req.body.MAC);
  console.log("id ", req.body.socketID);
  console.log("name ", req.body.userName);
  var socket = new Socket({
    socketID: req.body.socketID,
    userName: req.body.userName,
    MAC: req.body.MAC
  });

  var waitList = await WaitingSock.find({});
  try{
    await socket.save((err)=>{
      if(err){
        console.log("err add socket ", err);
      }
    });
    console.log("successfully add a device ", socket.MAC);
    var removeFrom = await WaitingSock.findOneAndDelete({
      MAC: req.body.MAC
    });
    if (removeFrom){
      console.log("remove a socket from waitlist ", removeFrom.MAC);
    }
    waitList = await WaitingSock.find({});
    
    return res.render("addDevices", {
      name: req.cookies.user,
      lv: req.cookies.userLevel,
      waitList: waitList,
      success: "Added device "+ socket.socketID + " !",
    });
  }catch(e){
    return res.render("addDevices", {
      name: req.cookies.user,
      lv: req.cookies.userLevel,
      waitList: waitList,
      error: "Fail to add device! "+ socket.socketID + " !",
    });

  }
  

  res.redirect('/');

});

router.get("/assignToSocket", verify, async function (req, res) {
  var currentUser = req.cookies.user;
  var level = await Users.find({ userName: currentUser }, { roleLevel: 1 });

  var abcd = parseInt(level[0].roleLevel);
  if (abcd == null || abcd == undefined || abcd < 5) {
    res.send("Access denied");
    return;
  }

  const socketList = await Socket.find({ "$or": [{userName: null}, {userName: ""}]},{socketID:1});
  var socketData = [];
  for (var i = 0; i < socketList.length; ++i) {
    socketData.push(socketList[i].socketID);
  }

  const fullSocketList = await Socket.find({}, { socketID: 1, userName: 1 });
  // const userWithSockets = await Socket.distinct("userName");
  var fullData = [];
  var halfData = [];

// for(var i=0;i<userWithSockets.length;++i){
//   halfData.push(userWithSockets.userName);
// }

  //if that socket has an owner
  for (var i = 0; i < fullSocketList.length; ++i) {
    if (
      fullSocketList[i].userName != null &&
      fullSocketList[i].userName != ""
    ) {
      fullData.push([fullSocketList[i].socketID, fullSocketList[i].userName]);
      if(!halfData.includes(fullSocketList[i].userName))
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
    userDatas: userData, //All users, 無論有冇socket assigned.
    socketDatas: socketData,// All sockets with no owner
    iteration1: userData.length,
    iteration2: socketData.length,
    fullDatas: fullData, //[socketID, userName], those socket id with owner
    iteration3: fullData.length,
    halfDatas: halfData,//list of unique username, where those users has a socket assigned.
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
    //clear the username and attached field of socket table, also turn the socket off
    await Socket.update({ socketID: sId }, { $set: { userName: null, attached: false, powerOn: false } });

    //clear all datas collected
    await EnUse.remove({socketID: sId});
    await daily.remove({socketID:sId});
    await plan.remove({socketID: sId});
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

    // const temp = await Socket.find({userName: UN},{socketID:sId});
    // if(temp[0]!=undefined)
    // if(temp[0].socketID!=null){
    // console.log("HAPPY!!!!!!");
    // await Socket.update({socketID: temp[0].socketID},{$set:{userName: null}});
    // }
    await Socket.update({socketID: sId},{$set:{userName: UN, attached: false}});

    res.render("succUpPer",{name : req.cookies.user, lv: req.cookies.userLevel});
});

router.get('/disconnectSocket', verify, async function(req,res){
  var currentUser = req.cookies.user;
  var level = await Users.find({userName: currentUser},{roleLevel:1});
  
  var abcd = parseInt(level[0].roleLevel);
  if(abcd==null||abcd==undefined||abcd<5){
  res.send("Access denied");
  return;
  }
  var q = url.parse(req.url,true).query;
  var sId = q.sId;
  await Socket.remove({socketID: sId});
  await EnUse.remove({socketID: sId});
  await daily.remove({socketID: sId});
  await plan.remove({socketID: sId});
  res.render("succUpPer",{name: req.cookies.user, lv: req.cookies.userLevel});
})

module.exports = router;