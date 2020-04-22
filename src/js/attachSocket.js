// const db = require('../models/db');
// var db = connect('143.89.130.87:5000/Final_Year_Project/Users');

$(document).ready(function(){
    console.log(mySocket);
    if(mySocket.length > 0){
        // var selectionMenu = document.createElement("select");
        // $(selectionMenu).addClass("custom-select");
        // $(selectionMenu).attr({multiple:"multiple",
        //                         id : "selectSocket"});
        var radioButtons = document.createElement("div");
        $(radioButtons).attr({id : "radioButtons"});

        var anchorList = document.createElement("ul");
        // $(anchorList).addClass("m-2");

        for (const socket of mySocket) {
            console.log(socket.socketID);

            // var header = document.createElement("h2");
            // header.append(socket.socketID);
            // $(".modal-body").append(header);

            // var option = document.createElement("option");
            // option.append(socket.socketID);
            // $(option).addClass("p-2 m-2");
            // $(option).attr("value",socket.socketID);
            // selectionMenu.append(option);

            var radio = document.createElement("input");
            $(radio).attr({type:"radio",
                            value:socket.socketID,
                            id:socket.socketID+"-radio",
                            name:"atSock"});
            $(radio).css("display","none");

            $(radioButtons).append(radio);

            // $(radio).addClass("form-check-input");

            // var label = document.createElement("label");
            // $(label).attr("for",socket.socketID);
            // label.append(socket.socketID);

            var li = document.createElement("li");
            $(li).addClass("m-2");

            var radioAnchor = document.createElement("a");
            $(radioAnchor).attr({herf:"", id:socket.socketID});
            radioAnchor.append(socket.socketID);

            $(li).append(radioAnchor);
            $(anchorList).append(li);

            // var div = document.createElement("div");
            // $(div).addClass("p-2 m-2 border border-danger");

            // var radio2 = document.createElement("input");
            // $(radio2).attr({type:"radio",name:"atSock"});

            // div.append(radio,label);
            //   div.append(label);
            // $(".modal-body").append(radio);
            // $(".form-check").append(div);

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
        // buttonRequest.classList.add("btn");
        // buttonRequest.classList.add("btn-primary");
        // buttonRequest.classList.add("mx-2");
        $(buttonRequest).addClass("btn btn-primary mx-2");

        var buttonAssign = document.createElement("button");
        buttonAssign.append("Assign Sockets");
        $(buttonAssign).addClass("btn btn-danger mx-2");
        $(".modal-body").append(buttonRequest, buttonAssign);

    }

    if (attachedSock!=null){
        // var id = "#"+attachedSock.socketID;
        // console.log(id);
        // $(id).addClass("selected");
        // var i = document.createElement("i");
        // $(i).attr({id:"tick"});
        // $(i).css({position:"absolute",right:"0",margin:"0.4rem 1rem"});
        // $(i).addClass("fa fa-check");
        // $(id).append(i);

        // var rid = id+"-radio";
        // $(rid).prop("checked", true);

        $("#attach").css("display","none");
        $("#attached").css("display","block");
        var p = document.createElement("p");
        p.append(JSON.stringify(attachedSock));
        // p.css("white-space","initial");
        $("#socket").prepend(p);
        $("#socket").css("word-wrap","break-word");
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
            $(i).css({position:"absolute",right:"0",margin:"0.4rem 1rem"});
            $(i).addClass("fa fa-check");
            $(this).append(i);
          }
    });
    // $("#close").on("click",function(){
    //     console.log(attachedSock);
    //     if(attachedSock==null){
    //             $("#anchorList ul li a").removeClass("selected");
    //             $("#tick").remove();
    //             $("input[name='atSock']").prop("checked",false);
            
    //     }
    // });
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
            $(i).css({position:"absolute",right:"0",margin:"0.4rem 1rem"});
            $(i).addClass("fa fa-check");
            $(id).append(i);
    
            var rid = id+"-radio";
            $(rid).prop("checked", true);
        }
    });
});
