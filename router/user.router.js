var router = require('express').Router();

var user = require('./../controller/user.controller')

router.post('/register',user.register);

router.post('/login',user.login);

router.get('/fetch', user.fetch);


module.exports=router





