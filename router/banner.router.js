var router = require('express').Router();

var banner = require('./../controller/banner.controller')

router.post('/add', banner.add);

router.get('/fetch', banner.fetch);

router.delete('/delete',banner.delete);

router.patch('/udpate',banner.update)

module.exports = router
