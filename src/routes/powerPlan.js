const express = require('express');
const app = express();
const router = require('express').Router();
const verify = require('./verifyToken');
const url = require('url');
const schedule = require('node-schedule');
const Socket = require('../models/Socket')
const plan = require('../models/PowerPlan');
// const Users = require('../models/Users');
// const bcrypt = require('bcryptjs');

router.get('/managePower',verify, (req,res)=>{
    console.log(req.cookies.authToken);
    var user = req.cookies.user;
    var socket = req.cookies.attachedSockID;
    res.render('managePower',{name : req.cookies.user, lv: req.cookies.userLevel, socketID: socket});
    });

    router.get('/schedulePower', verify,  async (req,res)=>{
        var q=url.parse(req.url,true).query; //req.url = the full link to the website
        var id=q.id;
        var hour=q.h;

        var minute = q.m;
        // var taskName = id.toString();
        var taskName = (id).toString();
        console.log("schedule to turn off at "+hour+":"+minute+" for socket: "+taskName)

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
        res.send("scheduled");

    })



    router.get('/cancelSchedule', verify, async (req,res)=>{
        var q = url.parse(req.url,true).query;
        var id=q.id;
        var taskName = id.toString();
        console.log(schedule.scheduledJobs[taskName]);
        console.log("cancel power plan for socket: "+taskName);
        var jobs = schedule.scheduledJobs;
        if(jobs[taskName]!=null&&jobs[taskName]!=undefined){
            //remove from PowerPlan
        await plan.remove({socketID: taskName})
        //cancel from task list
        jobs[taskName].cancel();
        res.send("cancelled")
    }
    else{
        res.send("nothing to cancel");
    }
    })
module.exports = router;