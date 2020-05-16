// import { compare } from "bcryptjs";

$(document).ready(function(){
  
    console.log(mySocket);
    if(mySocket.length > 0){

        var radioButtons = document.createElement("div");
        $(radioButtons).attr({id : "radioButtons"});

        var anchorList = document.createElement("ul");
        // $(anchorList).addClass("m-2");

        for (const socket of mySocket) {
            console.log(socket.socketID);

            var radio = document.createElement("input");
            $(radio).attr({type:"radio",
                            value:socket.socketID,
                            id:socket.socketID+"-radio",
                            name:"atSock"});
            $(radio).css("display","none");

            $(radioButtons).append(radio);

            var li = document.createElement("li");
            $(li).addClass("m-2");

            var radioAnchor = document.createElement("a");
            $(radioAnchor).attr({herf:"", id:socket.socketID});
            radioAnchor.append(socket.socketID);

            $(li).append(radioAnchor);
            $(anchorList).append(li);

        }
        $(".modal-body").append(radioButtons);
        $("#anchorList").append(anchorList);


        var buttonSave = document.createElement("button");
        $(buttonSave).addClass("btn btn-primary");
        $(buttonSave).attr("type","submit");
        buttonSave.append("Save changes");
        $(".modal-footer").prepend(buttonSave);

    }else{
        $(".modal-body").append("<h2>You don't have socket yet</h2>");
        var buttonRequest = document.createElement("button");
        buttonRequest.append("Request for Socket");
        $(buttonRequest).addClass("btn btn-primary mx-2");
        // $(buttonRequest).attr("href")

        var buttonAssign = document.createElement("button");
        buttonAssign.append("Assign Sockets");
        $(buttonAssign).addClass("btn btn-danger mx-2");
        $(buttonAssign).attr({
        //   href: "/office/assignToSocket",
        onclick: "location.href='/office/assignToSocket'",
          type: "button",
        });
        // $(".modal-body").append(buttonRequest);
        if (lv >=5){
            $(".modal-body").append(buttonAssign);
        }
    }

    if (attachedSock!=null){
      // <----schedule info
        $("#planinfo").parent().parent().css("display","block");

        if(powerPlan != null){
          var hour = powerPlan.Hour.toString();
          if (hour.length <2){
            hour = "0" + hour;
          }
          $("#planinfo").append(hour+":");
          var minute = powerPlan.Minute.toString();
          console.log(minute.length);
          if (minute.length <2){
            minute = "0" + minute;
          }
          $("#planinfo").append(minute);
          
        }else{
          $("#planinfo").append("None");
        }
        // schedule info---->


        // <---- attached socket
        $("#attach").css("display","none");
        $("#attached").css("display","block");

        console.log(attachedSock);
        console.log(attachedSock.maxCurrent);
        var dName = document.createElement("p");
        dName.append(attachedSock.socketID);
        $(dName).css({
          display: "inline-block",
          position: "relative",
          top: "20px",
          fontWeight:"bold",
          fontSize:"20px",
          fontStretch:"ultra-expanded",
          margin:"0",
          textAlign :"center",
          color:"gray"
        });
        $(".socket-info").prepend(dName);
        var p = document.createElement("p");
        p.append(attachedSock.minCurrent);
        $(p).css({fontSize: "4rem"});
        $(p).attr({id: "currentValue"});
        $(".socket-current").append(p);

        //------attached socket---->

        // <----- powerOn
        console.log(attachedSock.powerOn);
        if(attachedSock.powerOn){
            $("input[type=checkbox]").prop("checked", true);
            $("#socket").css({animation: "circle 8s infinite linear"});

        }
        // powerOn----->

    }


    $("#anchorList ul li a").on("click",function(){
        var radioid = "#"+$(this).attr("id")+"-radio";
        console.log(radioid);
        var checkedinput = $("input[name='atSock']:checked").val();
        
        if (checkedinput == undefined){
            $(radioid).prop("checked", true);
        }else{
            $("input[name='atSock']").prop("checked",false);
            $(radioid).prop("checked", true);
        }
        var checkedVal = $("input[name='atSock']:checked").val();
        console.log(checkedVal);


        if($(this).hasClass("selected")) {
          } else {
            $("#anchorList ul li a").removeClass("selected");
            $("#tick").remove();
            $(this).addClass("selected");
            var i = document.createElement("i");
            $(i).attr({id:"tick"});
            $(i).css({position:"absolute",right:"0",margin:"0.4rem 25px"});
            $(i).addClass("fa fa-check");
            $(this).append(i);
          }
    });
    $("#attachModal").on("hide.bs.modal",function(){
        console.log("dismiss");
        // if(attachedSock==null){
                $("#anchorList ul li a").removeClass("selected");
                $("#tick").remove();
                $("input[name='atSock']").prop("checked",false);
            
        // }
    });
    $("#attachModal").on("show.bs.modal",function(){
        if (attachedSock!=null){
            var id = "#"+attachedSock.socketID;
            console.log(id);
            $(id).addClass("selected");
            var i = document.createElement("i");
            $(i).attr({id:"tick"});
            $(i).css({position:"absolute",right:"0",margin:"0.4rem 25px"});
            $(i).addClass("fa fa-check");
            $(id).append(i);
    
            var rid = id+"-radio";
            $(rid).prop("checked", true);
        }
    });

    
    const socket = io.connect("/IOT");
    $("input[type=checkbox]").change(function(){
        if(!$(this).is(':checked')){
          // if(!confirm("Confirm switching off socket?")){
          //   $("input[type=checkbox]").prop("checked",true);
          //   return false;
          // }else{
            
            $("#socket").css({animation: ""});
            $("#currentValue").html("0");
            socket.emit("powerOnOff", {
              socketID: attachedSock.socketID,
              userName: name,
              powerOn: false  
            });
          // }
        }
        else{
        console.log("on");
          $("#socket").css({animation: "circle 8s infinite linear"});
          socket.emit("powerOnOff", {
            socketID: attachedSock.socketID,
            userName: name,
            powerOn: true
          });
        }
    });


    socket.on("currentToHome", async (id, data) => {
      console.log("currentToHome");
      console.log(data, id);
      console.log(attachedSock.id);
      console.log(attachedSock.id==id);
      if (attachedSock.socketID == id){
        var curr = data.substring(0,5);
      
        $("#currentValue").html(curr+"A");
      }

    });
    
});
