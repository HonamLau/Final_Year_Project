const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
const Socket =require('../models/Socket');
const daily=require('../models/dailyUsage');
//EnergyUse.js-> storing everyday's current flow inside, lots of duplicate to be added up in a day
//daily-> storing those added up data of EnergyUse, and store it by date.
const EnUse = require('../models/EnergyUse');
const db = require('../models/db');
const models = db.models;
var EnergyUse =  models.EnergyUse; 



router.get('/usage',verify,(req,res)=>{
    res.render('stats');
});

router.get("/lookup", verify, async (req, res) => {
  console.log("wants to lookup");
  console.log("cookies's username: " + req.cookies.user);

  const socID = await Socket.find(
    {
      userName: req.cookies.user,
    },
    {
      socketID: 1,
    }
  );
  //get the socketID of the current user's
  const ID = socID[0].socketID;
  console.log("current user's socket ID is: "+ID);
  //count how many datas of this ID is in dailyUsage.
  const countOfDataInDaily = await daily
    .find({
      socketID: ID,
    })
    .countDocuments();
  if (countOfDataInDaily > 7) {
    countOfDataInDaily = 7;
  }
  //search for the data in dailyusage, by ID
  const usageData = await daily
    .find(
      {socketID: ID },
      {
        year: 1,
        month: 1,
        day: 1,
        totalUse: 1,
        _id: 0,
      }
    )
    .sort({ year: -1, month: -1, day: -1 })
    .limit(countOfDataInDaily);
  //put the data in array:
  var data = [];
  // for(var i=0;i<countOfDataInDaily;++i){
  //     var date=usageData[i].year.toString()+usageData[i].month.toString()+"/"+usageData[i].day.toString();
  //     var use=usageData[i].totalUse;
  //     data.push(usageData[i]);
  //     console.log(data[i]);
  // }
  for (var i = 0; i < 7; ++i) {
    if (i < countOfDataInDaily) {
      var date =
        usageData[i].year.toString() +
        "/" +
        usageData[i].month.toString() +
        "/" +
        usageData[i].day.toString();
      var use = parseInt(usageData[i].totalUse);
      data.push([date, use]);
    } else {
      var x = "/";
      var y = null;
      data.push([x.toString(), parseInt(y)]);
    }
  }
  console.log("date: " + data[0][0]);
  console.log("use: " + data[0][1]);

  res.render("stats", { datas: data, loop: countOfDataInDaily, name:req.cookies.user, lv: req.cookies.userLevel});
});



router.get("/peekUse", verify, async (req,res)=>{
  var currentUser = req.cookies.user;
  var num = await Socket.find({userName: currentUser},{socketID:1, _id:0});
  console.log(num);
  var data = [];
  var d = [];
  if(num!=undefined){
    console.log("This User Owns a socket "+"with id"+num[0].socketID+"!");
// var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
// var count = result1.length;
var r1 = await EnUse.find({socketID:num[0].socketID},{YMD:1, _id:0}).sort({dateTime:-1});
var buffer = [];
for(var i=0;i<r1.length; ++i){
  if(buffer.includes(r1[0].YMD))
  continue;
  else
  buffer.push(r1[i].YMD);
}
//now buffer contains a list of distinct&sorted YMD

count = buffer.length;

if(count>7)
count=7;

for(var i=0;i<7;++i){

  if(i>=count)
break;
  else{
  var result2 = await EnUse.find({YMD: buffer[i]},{current:1,YMD:1, Hour:1, Minute:1}).sort({current:-1}).limit(1);
  var dt = result2[0].YMD.toString()+" "+result2[0].Hour.toString()+":"+result2[0].Minute.toString();
  data.push([dt, parseInt(result2[0].current)]);


  }
  
}
// console.log("found "+data.length+" data")
 var size = data.length;
// for(var i = 0;i<size;++i){
//   console.log(data[i]);
// }
// if(size>0){
//     //sort data by dateTime
//     for(var i=0;i<size;++i){
//       for(var j=i+1;j<size;++j){
//         if(data[i][2].getTIme()>data[j][2].getTime()){
//         temp = data[i];
//         data[i] = data[j];
//         data[j] = temp;
//         }
//       }
//         }
// } //end of sorting
if(size<7){
  console.log("start pushing"+(7-size)+" dummy datas")
  for(var i=parseInt(size);i<7;++i){
    data.push(["/",null]);
  }
}
  }
 else{ //user has no socket assigned yet.
    for(var i=0; i < 7; ++i)
    data.push["/",null]
 }

 console.log(data.length);
  res.render("peekStats",{datas: data, name:req.cookies.user, lv: req.cookies.userLevel});
})



router.get("/minUse", verify, async (req,res)=>{
  var currentUser = req.cookies.user;
  var num = await Socket.find({userName: currentUser},{socketID:1, _id:0});
  console.log(num);
  var data = [];
  var d = [];
  if(num!=undefined){
    console.log("This User Owns a socket "+"with id"+num[0].socketID+"!");
// var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
// var count = result1.length;
var r1 = await EnUse.find({socketID:num[0].socketID},{YMD:1, _id:0}).sort({dateTime:-1});
var buffer = [];
for(var i=0;i<r1.length; ++i){
  if(buffer.includes(r1[0].YMD))
  continue;
  else
  buffer.push(r1[i].YMD);
}
//now buffer contains a list of distinct&sorted YMD

count = buffer.length;

if(count>7)
count=7;

for(var i=0;i<7;++i){

  if(i>=count)
break;
  else{
  var result2 = await EnUse.find({YMD: buffer[i], current: {$ne:0},current:{$ne :null}, current:{$ne: undefined}},{current:1,YMD:1, Hour:1, Minute:1}).sort({current:1}).limit(1);
  var dt = result2[0].YMD.toString()+" "+result2[0].Hour.toString()+":"+result2[0].Minute.toString();
  data.push([dt, parseInt(result2[0].current)]);


  }
  
}
 var size = data.length;

if(size<7){
  console.log("start pushing"+(7-size)+" dummy datas")
  for(var i=parseInt(size);i<7;++i){
    data.push(["/",null]);
  }
}
  }
 else{ //user has no socket assigned yet.
    for(var i=0; i < 7; ++i)
    data.push["/",null]
 }

 console.log(data.length);
  res.render("minStats",{datas: data, name:req.cookies.user, lv: req.cookies.userLevel});
})

    
module.exports = router