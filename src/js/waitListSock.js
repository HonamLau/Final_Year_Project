$(document).ready(function () {
  console.log(waitList);
  if (waitList.length > 0) {
    $("#noSocket").css("display","none");
    for (const sock of waitList) {
      var idStr = sock.socketID;
      var li = document.createElement("li");
      var a = document.createElement("a");
      $(li).attr("id", idStr.substring(5));
      $(a).attr({herf:""});
      a.append(sock.MAC);
      li.append(a);
      $("#waitingList").append(li);


      var radio = document.createElement("input");
      $(radio).attr({type:"radio",
                      value:sock.MAC,
                      id:idStr.substring(5)+"-radio",
                      name:"addSock"});
      // $(radio).css("display","none");

      $("#radio-List").append(radio);
    }
  }
  const wait = io.connect("/IOT");
  wait.on("waitingList", (data) => {
    $("#noSocket").css("display","none");
    console.log(data);

      var idStr = data.socketID;
      var li = document.createElement("li");
      var a = document.createElement("a");
      $(li).attr("id", idStr.substring(5));
      $(a).attr({herf:""});
      a.append(data.MAC);
      li.append(a);
      $("#waitingList").append(li);

      var radio = document.createElement("input");
      $(radio).attr({type:"radio",
                      value:data.MAC,
                      id:idStr.substring(5)+"-radio",
                      name:"addSock"});

      $("#radio-List").append(radio);
    
  });
  wait.on("disconnectMatching", (data) => {
    
    console.log("disconnect ", data);

    var idStr = data;
    var id = idStr.substring(4);
    $(id).remove();

    var radioID = id + "-radio";
    $(radioID).remove();

    if($("#waitingList a").length == 0){
      $("#noSocket").css("display","block");
    };

  });

  // $("#waitingList a").on('click',function(){
  $("body").on('click','#waitingList a',function(){
    // console.log($("#waitingList a"));
    var radioid = "#"+$(this).parent().attr("id")+"-radio";
    console.log(radioid);

    var checkedinput = $("input[name='addSock']:checked").val();
        
    if (checkedinput == undefined){
        $(radioid).prop("checked", true);
    }else{
        $("input[name='addSock']").prop("checked",false);
        $(radioid).prop("checked", true);
    }
    var checkedVal = $("input[name='addSock']:checked").val();
    console.log("checked ", checkedVal," ", radioid);

    if($(this).hasClass("selected")) {
      $("#waitingList a").removeClass("selected");
      $("#tick").remove();
      $("input[name='addSock']").prop("checked",false);
      console.log("checked ", $("input[name='addSock']:checked").val());
      $("#addButton").prop("disabled","true");
      
    } else {
      $("#addButton").prop("disabled","false");
      $("#addButton").removeAttr("disabled");

      $("#waitingList a").removeClass("selected");
      $("#tick").remove();
      $(this).addClass("selected");
      var i = document.createElement("i");
      $(i).attr({id:"tick"});
      $(i).css({position:"relative",right:"0",margin:"0.4rem 1rem"});
      $(i).addClass("fa fa-check-circle");
      $(this).append(i);
    }

  });

  $("#addSockModal").on("show.bs.modal",function(){
    var selected = $("#waitingList a.selected");
    var radioid = "#"+$(selected).parent().attr("id")+"-radio";
    console.log($(radioid).attr("value"));
    $("input[name=MAC]").val($(radioid).attr("value"));
    $("input[name=MAC]").prop("disabled","true");


  });
  $("#addDeviceToServer").submit(function(){
    $("input[name=MAC]").prop("disabled","false");
    $("input[name=MAC]").removeAttr("disabled");
  });


});
