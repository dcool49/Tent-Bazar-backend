require('dotenv').config();

var PORT=process.env.PORT
var HOST=process.env.HOST
var HOSTURL=process.env.HOSTURL
var DB_CONNECTION=process.env.DB_CONNECTION
var ACCESS_KEY=process.env.ACCESS_KEY
var SECRET_ACCESS_KEY=process.env.SECRET_ACCESS_KEY


module.exports={
    PORT : PORT,
    DB_CONNECTION:DB_CONNECTION,
    HOST:HOST,
    HOSTURL:HOSTURL,
    ACCESS_KEY:ACCESS_KEY,
    SECRET_ACCESS_KEY:SECRET_ACCESS_KEY
}