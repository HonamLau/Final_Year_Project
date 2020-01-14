var http = require("http");
var app = require('express')();
var appWs = require('express-ws')(app);


app.get('/',function(request, response){
    response.send('Hello World')
}
);

app.listen(3000,function(){
    console.log('Sever Listening')
})
