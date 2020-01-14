const http = require("http");
const app = require('express')();
const path = require('path');
// coonst appWs = require('express-ws')(app);



app.get('/',function(request, response){
    response.send('Hello World')
}
);

app.listen(3000,function(){
    console.log('Sever Listening')
})
