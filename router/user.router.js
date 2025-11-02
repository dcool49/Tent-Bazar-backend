var router = require('express').Router();

var user = require('./../controller/user.controller')

router.post('/register',user.register);

router.post('/login',user.login);

router.post('/v2/login',user.loginNew);

router.post('/v2/register',user.registerNew);

router.get('/fetch', user.fetch);

router.patch('/update', user.update);

router.post('/validateUser', user.validateUser);


module.exports=router





