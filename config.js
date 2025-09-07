require('dotenv').config();

var PORT=process.env.PORT
var HOST=process.env.HOST
var DB_CONNECTION=process.env.DB_CONNECTION
var ACCESS_KEY=process.env.ACCESS_KEY
var SECRET_ACCESS_KEY=process.env.SECRET_ACCESS_KEY


module.exports={
    PORT : PORT,
    DB_CONNECTION:DB_CONNECTION,
    HOST:HOST,
    ACCESS_KEY:ACCESS_KEY,
    SECRET_ACCESS_KEY:SECRET_ACCESS_KEY
}