var http = require("http");
var app = require('express')();
var appWs = require('express-ws')(app);

app.ws('/echo', ws => {
    ws.on('message')
}
)

