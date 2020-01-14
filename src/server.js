const http = require("http");
const app = require('express')();
const path = require('path');

app.get('/',function(request, response){
    response.sendFile(path.join(__dirname,'../','public','index.html'))
}
);

app.listen(3000,function(){
    console.log('Sever Listening')
})
