var router = require('express').Router();

var Urls = require('./../controller/urls.controller');

router.post('/add', Urls.add);

router.get('/fetch',Urls.fetch);

router.delete('/delete',Urls.delete);

module.exports=router
