
// <---------- Drag ------------>

$(document).ready(function () {
    console.log(socketList);
    if(socketList.length >0){
        for (const sock of socketList) {
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


    // <---------- Drag ------------>

let dragSources = document.querySelectorAll('[draggable="true"]');
dragSources.forEach((dragSource) => {
  dragSource.addEventListener("dragstart", dragStart);
});

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
//   console.log(e);
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
  // $(target).removeClass("inHole");
  // if($(target).children().length >1){
  //   //   console.log($(target).children(".current"));
  //   $(target).find(".current").remove();
  // }
//   console.log(e.target);
  if ($(e.target).hasClass("hole")){
      this.classList.add('haveSock');
      var inHole = $(this).children();
      $(inHole).addClass("inHole");
    //   var p = document.createElement("p");
    //   $(p).addClass("current");
    //   p.append("13");
    //   $(inHole).append(p);
  }
}

function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function dragLeave (e) {
    // console.log(this);
    // console.log(e);
    // let id = e.dataTransfer.getData("text/plain");
    // console.log(document.querySelector("#" + id));
    var source = e.srcElement;
    // var out = "#" +id;
    console.log(e.fromElement);
    if($(source).hasClass("hole")){
        $(source).children().removeClass("inhole");
        
    }
  }
});
