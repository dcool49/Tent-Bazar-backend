var router = require('express').Router();
var product = require('./../controller/product.controller')



router.post('/add', product.add);

router.get('/fetch',product.fetch);

router.put('/update',product.update);

router.get('/fetchbyid',product.fetchbyid)

router.delete('/deleteimage',product.imageDelete)

router.put('/updateimage',product.imageUpdate)

router.delete('/delete', product.delete)


module.exports = router