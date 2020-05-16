
// <---------- Drag ------------>

$(document).ready(function () {
  const socket = io.connect("/IOT");
  // socket.emit("current", "123","456")

    console.log("sockList:  ",socketList);
    console.log("sList:  ", sList);
    console.log("holeList:  ", holeList);

    if(sList.length >0){
        for (const sock of sList) {
            var div = document.createElement("div");
            $(div).attr({draggable:"true", id:"s-"+sock.socketID,});
            $(div).addClass("sockOption")
            // $(div).css({border:"black 2px solid"});
            var a = document.createElement("a");
            var br = document.createElement("br");
            a.append(sock.socketID);
            a.append(br);
            if (sock.userName){
              a.append( "(" + sock.userName+")");
            }
            else{
              a.append( "(------)");
            }
            div.append(a);

            $("#sList").append(div);
            
        }
    }
    if(holeList.length >0){
      for (const hole of holeList){
        var div = document.createElement("div");
        $(div).attr({draggable:"true", id:"s-"+hole.holeContentID,});
        $(div).addClass("sockOption")
        // $(div).css({border:"black 2px solid"});
        var a = document.createElement("a");
        var br = document.createElement("br");
        a.append(hole.holeContentID);
        a.append(br);
        if (hole.userName){
          a.append( "(" + hole.userName+")");
        }
        else{
          a.append( "(------)");
        }
        div.append(a);

        $(div).addClass("inHole");

        for (const sock of socketList) {
          if (sock.socketID == hole.holeContentID){
            if (sock.powerOn == true){
              $("#"+hole.holeID).addClass("powerOn");
            }
          }
          
        }
        $("#"+hole.holeID).append(div);
      }
    }


    // <---------- Drag ------------>

let dragSources = document.querySelectorAll('[draggable="true"]');
dragSources.forEach((dragSource) => {
  dragSource.addEventListener("dragstart", dragStart);
  // dragSource.addEventListener("dragend", dragEnd);
});

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
//   console.log(e);
  $(this).parent().removeClass("powerOn");
}
// Allow multiple dropped targets
let dropTargets = document.querySelectorAll(
  '[data-role="drag-drop-container"]'
);
dropTargets.forEach((dropTarget) => {
  dropTarget.addEventListener("drop", dropped);
  dropTarget.addEventListener("dragenter", cancelDefault);
  dropTarget.addEventListener("dragover", cancelDefault);
  // dropTarget.addEventListener("dragleave", dragLeave);
  
});

function dropped(e) {
  cancelDefault(e);
  let id = e.dataTransfer.getData("text/plain");
  var target = document.querySelector("#" + id);
  e.target.appendChild(document.querySelector('#' + id))
  $(target).removeClass("inHole");
  // $(target).parent().removeClass("powerOn");
  console.log(e);
  console.log(id);
  // if($(target).children().length >1){
  //   //   console.log($(target).children(".current"));
  //   $(target).find(".current").remove();
  // }
//   console.log(e.target);
  if ($(e.target).hasClass("hole")){
      this.classList.add('haveSock');
      var inHole = $(this).children();
      $(inHole).addClass("inHole");
      socket.emit("removeFromHole",id.substring(2));
      socket.emit("addToHole",$(inHole).parent().attr("id"),$(inHole).attr("id").substring(2));
      // socket.emit("addToHole","h1","h1");
      for (const sock of socketList) {
        if (sock.socketID == id.substring(2)){
          if (sock.powerOn == true){
            $(inHole).parent().addClass("powerOn");
            
          }
        }
        
      }
    //   var p = document.createElement("p");
    //   $(p).addClass("current");
    //   p.append("13");
    //   $(inHole).append(p);
  }
  else {
    socket.emit("removeFromHole",id.substring(2));
  }
}

function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

// function dragLeave (e) {
//     // console.log(this);
//     // console.log(e);
//     // let id = e.dataTransfer.getData("text/plain");
//     // console.log(document.querySelector("#" + id));
//     var source = e.srcElement;
//     // var out = "#" +id;
//     console.log(e.fromElement);
//     if($(source).hasClass("hole")){
//         $(source).children().removeClass("inhole");
        
//     }
//   }
  function dragEnd (e) {
    console.log(this.classList);
    // $(this).parent().removeClass("powerOn");
  }

  socket.on("toOffice", async (id , data) =>{
    console.log(id+" on is " + data);
      var holeID = "#s-"+id;
      for (var i = 0; i< socketList.length; i++){
        if (socketList[i].socketID == id){
          socketList[i].powerOn = data;
        }
      }
      if ($(holeID).hasClass("inHole")){
        if(data == true){
          $(holeID).parent().addClass("powerOn");
        }
        else{
          $(holeID).parent().removeClass("powerOn");
        }
      }
  });

});
