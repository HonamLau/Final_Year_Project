const http = require("http");
const express = require('express');
const app = express();
const path = require('path');

app.use('/static', express.static('public'));
app.get('/',function(request, response){
    response.sendFile(path.join(__dirname,'../','public','index.html'))
}
);

app.listen(5000,function(){
    console.log('Sever Listening')
})
