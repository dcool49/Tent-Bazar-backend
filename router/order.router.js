var router = require('express').Router();

var order = require('./../controller/order.controller')

router.post('/add',order.add);

router.get('/fetch',order.fetch);

router.patch('/update',order.update);


module.exports=router





