const http = require('http')
const app = require('./app')
const config = require('./config');
const Server = http.createServer(app);
Server.listen(config.port, ()=>{
    console.log('App is listening on url http://localhost:' + config.port);
});