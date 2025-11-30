var router = require('express').Router();

var order = require('./../controller/order.controller')

const common = require('../common/common');

router.post('/add',order.add);

router.post('/fetch',order.fetch);

router.patch('/update',common.verifyToken, order.update);


module.exports=router





