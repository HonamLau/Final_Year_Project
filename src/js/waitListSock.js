$(document).ready(function () {
  console.log(waitList);
  if (waitList.length > 0) {
    for (const sock of waitList) {
      var idStr = sock.socketID;
      var li = document.createElement("li");
      var a = document.createElement("a");
      $(li).attr("id", idStr.substring(5));
      $(a).attr({herf:""});
      a.append(sock.MAC);
      li.append(a);
      $("#waitingList").append(li);
    }
  }
  const wait = io.connect("/IOT");
  wait.on("waitingList", (data) => {
    console.log(data);
    // if (data.length > 0){
    //     for (const sock of data) {
      var idStr = data.socketID;
      var li = document.createElement("li");
      var a = document.createElement("a");
      $(li).attr("id", idStr.substring(5));
      $(a).attr({herf:""});
      a.append(data.MAC);
      li.append(a);
      $("#waitingList").append(li);
    //     }

    // }
  });
  wait.on("disconnectMatching", (data) => {
    console.log("disconnect ", data);
    var idStr = data;
    var id = idStr.substring(4);
    $(id).remove();
  });
});
