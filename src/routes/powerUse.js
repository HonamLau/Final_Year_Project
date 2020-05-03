const express = require("express");
const app = express();
const router = require("express").Router();
const verify = require("./verifyToken");
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
const Socket = require("../models/Socket");
const daily = require("../models/dailyUsage");
//EnergyUse.js-> storing everyday's current flow inside, lots of duplicate to be added up in a day
//daily-> storing those added up data of EnergyUse, and store it by date.
const EnUse = require("../models/EnergyUse");
const db = require("../models/db");
const models = db.models;
var EnergyUse = models.EnergyUse;
const Users = require("../models/Users");
const url = require("url");

router.get("/usage", verify, (req, res) => {
  res.render("stats");
});

router.get("/lookup", verify, async (req, res) => {
  console.log("wants to lookup");
  console.log("cookies's username: " + req.cookies.user);

  // const socID = await Socket.find(
  //   {
  //     userName: req.cookies.user,
  //   },
  //   {
  //     socketID: 1,
  //   }
  // );
  const socID = req.cookies.attachedSockID;
  var data = [];
  if (socID != undefined && socID != null && socID != "") {
    //get the socketID of the current user's
    const ID = socID;
    console.log("current user's socket ID is: " + ID);
    //count how many datas of this ID is in dailyUsage.
    countOfDataInDaily = await daily
      .find({
        socketID: ID,
      })
      .countDocuments();
    if (countOfDataInDaily > 7) {
      countOfDataInDaily = 7;
    }
    //search for the data in dailyusage, by ID
    const usageData1 = await daily
      .find(
        { socketID: ID },
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
    var usageData = [];

    for (var i = 0; i < usageData1.length; ++i) {
      usageData.push(usageData1[usageData1.length - 1 - i]);
      console.log(usageData[i].year);
    }
    //put the data in array:

    // for(var i=0;i<countOfDataInDaily;++i){
    //     var date=usageData[i].year.toString()+usageData[i].month.toString()+"/"+usageData[i].day.toString();
    //     var use=usageData[i].totalUse;
    //     data.push(usageData[i]);
    //     console.log(data[i]);
    // }
    for (var i = 0; i < 7; ++i) {
      if (i < countOfDataInDaily) {
        var date =
          usageData[i].year + "/" + usageData[i].month + "/" + usageData[i].day;
        var use = parseInt(usageData[i].totalUse);
        data.push([date, use]);
      } else {
        var x = "/";
        var y = null;
        data.push([x.toString(), parseInt(y)]);
      }
    }
  } else {
    for (var i = 0; i < 7; ++i) {
      var x = "/";
      var y = null;
      data.push([x.toString(), parseInt(y)]);
    }
  }

  //start of peak
  var morning = 0,
    afternoon = 0;
  var data2 = [];
  var d = [];
  if (socID != undefined && socID != null && socID != "") {
    // var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
    // var count = result1.length;
    var r1 = await EnUse.find(
      { socketID: socID },
      { YMD: 1, current: 1, _id: 0 }
    ).sort({ dateTime: -1 }).limit(7);
    r1.reverse();
    console.log("r1: "+r1);

    var buffer = [];
    console.log("r1 length = " + r1.length);
    for (var i = 0; i < r1.length; ++i) {
      console.log("current = " + r1[i].current);
      if (buffer.includes(r1[i].YMD)) continue;
      else buffer.push(r1[i].YMD);
    }
    //now buffer contains a list of distinct&sorted YMD

    count = buffer.length;

    if (count > 7) count = 7;

    for (var i = 0; i < 7; ++i) {
      if (i >= count) break;
      else {
        var result2 = await EnUse.find(
          { YMD: buffer[i], socketID: socID },
          { current: 1, YMD: 1, Hour: 1, Minute: 1 }
        )
          .sort({ current: -1 })
          .limit(1);
          if (result2[0].Minute==null)
          result2[0].Minute=0;
        var xyz = result2[0].YMD.toString().split("/");
        var dt =
          xyz[1] +
          "/" +
          xyz[2] +
          " " +
          result2[0].Hour.toString() +
          ":" +
          result2[0].Minute.toString();
        if (result2[0].Hour < 12) ++morning;
        else ++afternoon;
        data2.push([dt, parseInt(result2[0].current)]);

        console.log("data2: " + data2[i]);
      }
    }
    var size = data2.length;

    if (size < 7) {
      console.log("start pushing" + (7 - size) + " dummy datas");
      for (var i = parseInt(size); i < 7; ++i) {
        data2.push(["/", null]);
      }
    }
  } else {
    //user has no socket assigned yet.
    console.log("no attached socket");
    for (var i = 0; i < 7; ++i) data2.push(["/", null]);
  }
  var UWSjson = await Socket.find(
    { $and: [{ userName: { $ne: null } }, { userName: { $ne: "" } }] },
    { socketID: 1, userName: 1, _id: 0 }
  );
  var UWS = [];
  for (var i = 0; i < UWSjson.length; ++i) {
    UWS.push([UWSjson[i].socketID, UWSjson[i].userName]);
  }
  console.log(UWS);
  res.render("stats", {
    datas: data,
    datas2: data2,
    m: morning,
    an: afternoon,
    name: req.cookies.user,
    lv: req.cookies.userLevel,
    UWS: UWS,
  });
});

router.get("/Monthly", verify, async (req, res) => {
  console.log("wants to lookup");
  console.log("cookies's username: " + req.cookies.user);
  const socID = req.cookies.attachedSockID;

  var data = [];
  if (socID != undefined && socID != null && socID != "") {
    //get the socketID of the current user's
    const ID = socID;
    console.log("current user's socket ID is: " + ID);
    //count how many datas of this ID is in dailyUsage.
     countOfDataInDaily = await daily
      .find({
        socketID: ID,
      })
      .countDocuments();
    if (countOfDataInDaily > 31) {
      countOfDataInDaily = 31;
    }
    //search for the data in dailyusage, by ID
    const usageData1 = await daily
      .find(
        { socketID: ID },
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

      var usageData = [];

    for (var i = 0; i < usageData1.length; ++i) {
      usageData.push(usageData1[usageData1.length - 1 - i]);
      console.log(usageData[i].year);
    }
 
    for (var i = 0; i < 31; ++i) {
      if (i < countOfDataInDaily) {
        var date =
          usageData[i].year.toString() +
          "/" +
          usageData[i].month.toString() +
          "/" +
          usageData[i].day.toString();
        var use = parseInt(usageData[i].totalUse);
        data.push([date, use]);
        console.log("usage Data: "+data[i])
      } else {
        var x = "/";
        var y = null;
        data.push([x.toString(), parseInt(y)]);
      }
    }
  } else {
    for (var i = 0; i < 31; ++i) {
      var x = "/";
      var y = null;
      data.push([x.toString(), parseInt(y)]);
    }
  }


  //start of peak
  var morning = 0,
    afternoon = 0;
  var data2 = [];
  var d = [];
  if (socID != undefined && socID != null && socID != "") {
    // var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
    // var count = result1.length;
    var r1 = await EnUse.find(
      { socketID: socID },
      { YMD: 1, current: 1, dateTime:1,_id: 0 }
    ).sort({ dateTime: 1 });
    var buffer = [];
    console.log("r1 length = " + r1.length);
    for (var i = 0; i < r1.length; ++i) {
      if (buffer.includes(r1[i].YMD)) continue;
      else buffer.push(r1[i].YMD);
    }
    //now buffer contains a list of distinct&sorted YMD

    count = buffer.length;

    if (count > 31) count = 31;

    for (var i = 0; i < 31; ++i) {
      if (i >= count) break;
      else {
        var result2 = await EnUse.find(
          { YMD: buffer[i], socketID: socID },
          { current: 1, YMD: 1, Hour: 1, Minute: 1 }
        )
          .sort({ current: -1 })
          .limit(1);
          if(result2[0].Minute==null)
          result2[0].Minute=0;
        var xyz = result2[0].YMD.toString().split("/");
        var dt =
          xyz[1] +
          "/" +
          xyz[2] +
          " " +
          result2[0].Hour.toString() +
          ":" +
          result2[0].Minute.toString();
        if (result2[0].Hour < 12) ++morning;
        else ++afternoon;
        data2.push([dt, parseInt(result2[0].current)]);
      }
    }
    var size = data2.length;

    if (size < 31) {
      console.log("start pushing" + (31 - size) + " dummy datas");
      for (var i = parseInt(size); i < 31; ++i) {
        data2.push(["/", null]);
      }
    }
  } else {
    //user has no socket assigned yet.
    for (var i = 0; i < 31; ++i) 
    data2.push(["/", null]);
  }

  // console.log("morning: "+morning+" afternoon: "+afternoon)
  res.render("Monthly", {
    type: "month",
    datas: data,
    datas2: data2,
    m: morning,
    an: afternoon,
    name: req.cookies.user,
    lv: req.cookies.userLevel,
  });
});

router.get("/Yearly", verify, async (req, res) => {
  console.log("wants to lookup");
  console.log("cookies's username: " + req.cookies.user);
  const socID = req.cookies.attachedSockID;

  var data = [];
  if (socID != undefined && socID != null && socID != "") {
    //get the socketID of the current user's
    const ID = socID;
    console.log("current user's socket ID is: " + ID);
    //count how many datas of this ID is in dailyUsage.
     countOfDataInDaily = await daily
      .find({
        socketID: ID,
      })
      .countDocuments();
    if (countOfDataInDaily > 31) {
      countOfDataInDaily = 31;
    }
    //search for the data in dailyusage, by ID
    const usageData1 = await daily
      .find(
        { socketID: ID },
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
      var usageData = [];
      for(var i=0;i<usageData1.length;++i){
        usageData.push(usageData1[usageData1.length-1-i])
      }
    //put the data in array:

    // for(var i=0;i<countOfDataInDaily;++i){
    //     var date=usageData[i].year.toString()+usageData[i].month.toString()+"/"+usageData[i].day.toString();
    //     var use=usageData[i].totalUse;
    //     data.push(usageData[i]);
    //     console.log(data[i]);
    // }
    for (var i = 0; i < 31; ++i) {
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
  } else {
    for (var i = 0; i < 31; ++i) {
      var x = "/";
      var y = null;
      data.push([x.toString(), parseInt(y)]);
    }
  }

  //start of peak
  var morning = 0,
    afternoon = 0;
  var data2 = [];
  var d = [];
  if (socID != undefined && socID != null && socID != "") {
    // var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
    // var count = result1.length;
    var r1 = await EnUse.find(
      { socketID: socID },
      { YMD: 1, current: 1, _id: 0 }
    ).sort({ dateTime: 1 });
    var buffer = [];
    console.log("r1 length = " + r1.length);
    for (var i = 0; i < r1.length; ++i) {
      console.log("current = " + r1[i].current);
      if (buffer.includes(r1[i].YMD)) continue;
      else buffer.push(r1[i].YMD);
    }
    //now buffer contains a list of distinct&sorted YMD

    count = buffer.length;

    if (count > 31) count = 31;

    for (var i = 0; i < 31; ++i) {
      if (i >= count) break;
      else {
        var result2 = await EnUse.find(
          { YMD: buffer[i], socketID: socID },
          { current: 1, YMD: 1, Hour: 1, Minute: 1 }
        )
          .sort({ current: -1 })
          .limit(1);
          if(result2[0].Minute==null)
          result2[0].Minute=0;
        var xyz = result2[0].YMD.toString().split("/");
        var dt =
          xyz[1] +
          "/" +
          xyz[2] +
          " " +
          result2[0].Hour.toString() +
          ":" +
          result2[0].Minute.toString();
        if (result2[0].Hour < 12) ++morning;
        else ++afternoon;
        data2.push([dt, parseInt(result2[0].current)]);
      }
    }
    var size = data2.length;

    if (size < 31) {
      console.log("start pushing" + (31 - size) + " dummy datas");
      for (var i = parseInt(size); i < 31; ++i) {
        data2.push(["/", null]);
      }
    }
  } else {
    //user has no socket assigned yet.
    for (var i = 0; i < 31; ++i) 
    data2.push(["/", null]);
  }

  res.render("Yearly", {
    type: "year",
    datas: data,
    datas2: data2,
    m: morning,
    an: afternoon,
    name: req.cookies.user,
    lv: req.cookies.userLevel,
  });
});

router.get("/othersWeekly", verify, async (req, res) => {
  var currentUser = req.cookies.user;
  var level = await Users.find({ userName: currentUser }, { roleLevel: 1 });

  var abcd = parseInt(level[0].roleLevel);
  if (abcd == null || abcd == undefined || abcd < 5) {
    res.send("Access denied");
    return;
  }

  var q = url.parse(req.url, true).query; //req.url = the full link to the website
  var id = q.id;
  var userViewing = q.userViewing;

  const ID = id;
  var data = [];
  console.log("current user's socket ID is: " + ID);
  //count how many datas of this ID is in dailyUsage.
  countOfDataInDaily = await daily
    .find({
      socketID: ID,
    })
    .countDocuments();
  if (countOfDataInDaily > 7) {
    countOfDataInDaily = 7;
  }
  //search for the data in dailyusage, by ID
  const usageData1 = await daily
    .find(
      { socketID: ID },
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
  var usageData = [];

  for (var i = 0; i < usageData1.length; ++i) {
    usageData.push(usageData1[usageData1.length - 1 - i]);
    console.log(usageData[i].year);
  }
  //put the data in array:

  // for(var i=0;i<countOfDataInDaily;++i){
  //     var date=usageData[i].year.toString()+usageData[i].month.toString()+"/"+usageData[i].day.toString();
  //     var use=usageData[i].totalUse;
  //     data.push(usageData[i]);
  //     console.log(data[i]);
  // }
  for (var i = 0; i < 7; ++i) {
    if (i < countOfDataInDaily) {
      var date =
        usageData[i].year + "/" + usageData[i].month + "/" + usageData[i].day;
      var use = parseInt(usageData[i].totalUse);
      data.push([date, use]);
    } else {
      var x = "/";
      var y = null;
      data.push([x.toString(), parseInt(y)]);
    }
  }

  //start of peak
  var morning = 0,
    afternoon = 0;
  var data2 = [];
  var d = [];

  // var result1 = await EnUse.distinct("YMD",{socketID: num[0].socketID});//.sort({datetime:-1});//find all dates that have record.
  // var count = result1.length;
  var r1 = await EnUse.find(
    { socketID: ID },
    { YMD: 1, current: 1, _id: 0 }
  ).sort({ dateTime: -1 }).limit(7);
  r1.reverse();
  console.log(r1);
  var buffer = [];
  console.log("r1 length = " + r1.length);
  for (var i = 0; i < r1.length; ++i) {
    console.log("current = " + r1[i].current);
    if (buffer.includes(r1[i].YMD)) continue;
    else buffer.push(r1[i].YMD);
  }
  //now buffer contains a list of distinct&sorted YMD

  count = buffer.length;

  if (count > 7) count = 7;

  for (var i = 0; i < 7; ++i) {
    if (i >= count) break;
    else {
      var result2 = await EnUse.find(
        { YMD: buffer[i], socketID: ID },
        { current: 1, YMD: 1, Hour: 1, Minute: 1 }
      )
        .sort({ current: -1 })
        .limit(1);
        if(result2[0].Minute==null)
        result2[0].Minute=0;
      var xyz = result2[0].YMD.toString().split("/");
      var dt =
        xyz[1] +
        "/" +
        xyz[2] +
        " " +
        result2[0].Hour.toString() +
        ":" +
        result2[0].Minute.toString();
      if (result2[0].Hour < 12) ++morning;
      else ++afternoon;
      data2.push([dt, parseInt(result2[0].current)]);

      console.log("data2: " + data2[i]);
    }
  }
  var size = data2.length;

  if (size < 7) {
    console.log("start pushing" + (7 - size) + " dummy datas");
    for (var i = parseInt(size); i < 7; ++i) {
      data2.push(["/", null]);
    }
  }

  var UWSjson = await Socket.find(
    { $and: [{ userName: { $ne: null } }, { userName: { $ne: "" } }] },
    { socketID: 1, userName: 1, _id: 0 }
  );
  var UWS = [];
  for (var i = 0; i < UWSjson.length; ++i) {
    UWS.push([UWSjson[i].socketID, UWSjson[i].userName]);
  }
  console.log(UWS);
  res.render("othersWeekly", {
    datas: data,
    datas2: data2,
    m: morning,
    an: afternoon,
    name: req.cookies.user,
    lv: req.cookies.userLevel,
    UWS: UWS,
    userViewings: userViewing,
  });
});
module.exports = router;
