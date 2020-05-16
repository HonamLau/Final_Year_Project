var Socket = require("./models/Socket");
var WaitingSock = require("./models/WaitingSock");
const officeHole =require('./models/officeHole');
var num;
var timeout;

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("test", (data) => {
      var string = data;
      console.log(string);
    });

    // socket.on("arduino"), (data)
  });

  io.of("/chat").on("connection", (socket) => {
    console.log("chat");
    socket.on("connect", (data) => {
      console.log(data);
    });
    socket.emit("a message", {
      that: "only",
      "/chat": "will get",
    });
  });

  var IOT = io.of("/IOT");
  IOT.on("connection", (socket) => {
    console.log("IOT connection");
    // socket match to server
    socket.on("socketToServer", async (MAC, data) => {
      console.log("MAC: ", MAC);
      console.log("data: ", data);
      console.log("id: ", socket.id);
      var matchedSock = await Socket.findOne({ MAC: MAC });
      if (matchedSock) {
        // socket.emit("socketToServer", true);
        console.log(matchedSock);
      } else {
        // register into temp table?
        console.log("no matched Sock");
        const waiting = new WaitingSock({
          MAC: MAC,
          socketID: socket.id,
        });
        IOT.emit("waitingList", {
          MAC: waiting.MAC,
          socketID: waiting.socketID,
        });
        try {
          await waiting.save((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("add to waitList");
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
    //socket match server -------->

    // socket disconnect
    socket.on("disconnect", async (reason) => {
      // console.log("disconnect socket");
      var waiting = await WaitingSock.findOneAndDelete({
        socketID: socket.id,
      });
      if (waiting) {
        console.log(waiting);
        console.log("remove from waitlist");
      }
      IOT.emit("disconnectMatching", socket.id);
    });
    // socket disconnect -------->

    socket.on("current", async (id, data) => {
      console.log("id: =", id);
      console.log("current: =", data);
      IOT.emit("currentToHome", id, data);
    });




    socket.on("realtime", async (data) => {
      num = data;
      // setTimeout(sendSignal(num),1000);
      console.log("signal fire ",data);
      setInterval(()=> sendSignal(num),3000);
      
    });

    socket.on("powerOnOff", async(data) =>{
      console.log("poweronoff");
      var socket = await Socket.findOneAndUpdate({
        socketID: data.socketID,
        userName: data.userName
      },
      { $set: { "powerOn" : data.powerOn}});

      if (socket){
        console.log("success on off");
      }else{
        console.log("fail on off");
      }

      var updated = await Socket.findOne({
        socketID: data.socketID,
        userName: data.userName
      });
      if (updated){
        IOT.emit("toOffice",data.socketID, updated.powerOn);
      }

    });


    socket.on("addToHole", async(holeID, data) =>{
      console.log("hole");
      console.log(holeID,data);
      var sock = await Socket.findOne({
        socketID: data
      })
      console.log(sock);
      console.log(sock.userName);
      

      var hole = new officeHole({
        holeID : holeID,
        holeContentID : data,
        userName : sock.userName
      })
      const saveHole = await hole.save((err)=>{
        if(err){
          console.log(err);
        }
      });
    });

    socket.on("removeFromHole", async(data) =>{
      console.log("removefromhole");
      console.log(data);
      var removefrom = await officeHole.findOneAndRemove({
        holeContentID : data
      })

      if(removefrom){
        console.log("removed");
        console.log(removefrom);
      }

    });

    
    function sendSignal(data) {
      num = data == 1 ? 0 : 1;
      // console.log('data to ', data, typeof(data));
      IOT.emit("sendSignal", num);
      
    }
  });
};
