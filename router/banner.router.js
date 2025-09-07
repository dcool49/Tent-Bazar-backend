var router = require('express').Router();

var banner = require('./../controller/banner.controller')

router.post('/add', banner.add);

router.get('/fetch', banner.fetch)

router.delete('/delete',banner.delete)

module.exports = router
