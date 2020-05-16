const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
const url = require('url');
const schedule = require('node-schedule');
const Socket = require('../models/Socket')
const plan = require('../models/PowerPlan');
const people = require('../models/Users');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');
 
router.get('/managePower',verify, async (req,res)=>{
    console.log(req.cookies.authToken);
    var user = req.cookies.user;
    var socket = req.cookies.attachedSockID;
    var p = 0, pForManager = 0;
    var tempList = await Socket.find({}, {socketID: 1, userName:1, _id: 0});
    var socketHasOwner = [];
   for(var i = 0; i<tempList.length; ++i){
       var tun = tempList[i].userName;
       if(tun!=null&&tun!=undefined&&tun!=""){
           var userLevel = await people.find({userName: tempList[i].userName});
           if(userLevel[0].roleLevel<req.cookies.userLevel)
           socketHasOwner.push([tempList[i].socketID, tempList[i].userName]);
       }
   }
     p += await plan.find({socketID: socket}).countDocuments();
     for(var i=0; i<socketHasOwner.length; ++i){

        pForManager += await plan.find({socketID: socketHasOwner[i][0].toString()}).countDocuments();
     }
    res.render('managePower',{name : req.cookies.user, 
                              lv: req.cookies.userLevel, 
                              socketID: socket, 
                              p: p, 
                              pForManager: pForManager,
                               socketIDForManager: socketHasOwner});
    });

    router.get('/schedulePower', verify,  async (req,res)=>{
        var q=url.parse(req.url,true).query; //req.url = the full link to the website
        var hour=q.h;
        var minute = q.m;
        var id=q.id;

        // var taskName = id.toString();

        if(id!="ALL"){
        console.log("schedule to turn off at "+hour+":"+minute+" for socket: "+taskName)

        var taskName = (id).toString();

        var job = schedule.scheduledJobs[taskName];

        //Remove the old task:
        if(job!=null&&job!=undefined){
         //cancel the previous schedule
        job.cancel();
        //clear the plan in PowerPlan
        await plan.remove({socketID: taskName});
        
    }

    //schedule new task:
    //insert the new plan to PowerPlan table.
    plan.insertMany({socketID: taskName, Hour: hour, Minute: minute});

        var temp = new Date();
        var d = new Date(temp.getFullYear(),temp.getMonth(),temp.getDate(),hour,minute);
        schedule.scheduleJob(taskName, d, async function(){

       //after turning it off, clear the PowerPlan Table.
       await plan.remove({socketID: taskName});
        console.log("PowerPlan table cleared");

       //change the switchedOn field of Socket to "false";
        await Socket.update({socketID: taskName}, {$set:{powerOn: false}});
        console.log("task completed, turned off Socket: "+taskName);
        })
    }
    else{
       console.log("schedule to turn off at "+hour+":"+minute+" for socket: "+taskName)
       var L1 = await Socket.find({});
       var allList = [];
       for(var i=0; i<L1.length; ++i){
           if(L1[i].userName!=null&&L1[i].userName!=undefined&&L1[i].userName!=""){
               var L2 = await people.find({userName: L1[i].userName});
               if(L2[0].roleLevel<5)
               allList.push(L1[i].socketID);
           }
       }
       for(var i=0; i<allList.length; ++i){
           var taskName = allList[i].toString();
           var job = schedule.scheduledJobs[taskName];
           if(job!=undefined&&job!=null)
           job.cancel();
           await plan.remove({socketID: taskName})

           plan.insertMany({socketID: taskName, Hour: hour, Minute: minute});

        var temp = new Date();
        var d = new Date(temp.getFullYear(),temp.getMonth(),temp.getDate(),hour,minute);
        schedule.scheduleJob(taskName, d, async function(){

       //before turning it off, clear the PowerPlan Table first.
       await plan.remove({socketID: taskName});
        console.log("PowerPlan table cleared");

       //change the switchedOn field of Socket to "false";
        await Socket.update({socketID: taskName}, {$set:{powerOn: false}});
        console.log("task completed, turned off Socket: "+taskName);
        })
       }
    }
            res.render("scheduleSuccess",{name: req.cookies.user, lv: req.cookies.userLevel});

    })



    router.get('/cancelSchedule', verify, async (req,res)=>{
        var q = url.parse(req.url,true).query;
        var id=q.id;
        if(id!="ALL"){
        var taskName = id.toString();
        console.log(schedule.scheduledJobs[taskName]);
        console.log("cancel power plan for socket: "+taskName);
        var jobs = schedule.scheduledJobs;
        if(await plan.find({socketID: taskName}).countDocuments()>0){
        if(jobs[taskName]!=null&&jobs[taskName]!=undefined){
            //remove from PowerPlan
            console.log("removing plan...")
        await plan.remove({socketID: taskName})
        //cancel from task list
        jobs[taskName].cancel();
        // res.send("cancelled");
    }
    else{
        res.send("last time didn't cancel plan b4 closing server");
        return;
    }
        }
    else{
        res.render("noPlanCancelManager", {name:req.cookies.user, lv: req.cookies.userLevel});
        return;
    }
}
else{
var L1 = await plan.find({});
var L2 = [];
for(var i=0; i<L1.length; ++i){
    if(L1[i].socketID!="dummy")
    L2.push(L1[i].socketID);
}
var L3 = []; //list of socket's IDs to cancel Schedule.
for(var i=0; i<L2.length; ++i){
    var sid = L2[i];
    var LT = await Socket.find({socketID: sid});
    var LT2 = await people.find({userName: LT[0].userName});
    if(LT2[0].roleLevel<5)
    L3.push(LT[0].socketID);
}
if(L3.length==0){
    res.render("noPlanCancelManager", {name: req.cookies.user, lv: req.cookies.userLevel});
    return;
}
for(var i=0; i<L3.length; ++i){
    var taskName = L3[0].toString();
    console.log(schedule.scheduledJobs[taskName]);
    console.log("cancel power plan for socket: "+taskName);
    var jobs = schedule.scheduledJobs;
    if(await plan.find({socketID: taskName}).countDocuments()>0){
    if(jobs[taskName]!=null&&jobs[taskName]!=undefined){
        //remove from PowerPlan
        console.log("removing plan...")
    await plan.remove({socketID: taskName})
    //cancel from task list
    jobs[taskName].cancel();
    // res.send("cancelled");
}
else{
    res.send("last time didn't cancel plan b4 closing server");
    return;
}
    }
else{
    res.render("noPlanCancelManager", {name:req.cookies.user, lv: req.cookies.userLevel});
    return;
}
}
}
res.render("cancelSuccess", {name: req.cookies.user, lv: req.cookies.userLevel})

    })
module.exports = router;