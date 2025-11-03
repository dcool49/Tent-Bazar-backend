var router = require('express').Router();

var user = require('./../controller/user.controller')

router.post('/register',user.register);

router.post('/login',user.login);

router.get('/fetch', user.fetch);

router.patch('/update', user.update);

router.patch('/updatePassword', user.updatePassword);

router.post('/validateUser', user.validateUser);

router.delete('/delete', user.delete);


module.exports=router





