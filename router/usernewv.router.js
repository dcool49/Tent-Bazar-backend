var router = require('express').Router();

var userV2 = require('../controller/usernewv.controller')


router.post('/login',userV2.loginNew);

router.post('/register',userV2.registerNew);

router.get('/fetch', userV2.fetch);

router.patch('/update', userV2.update);

router.patch('/updatePassword', userV2.updatePassword);

router.post('/validateUser', userV2.validateUser);

router.delete('/delete', userV2.delete);


module.exports=router





