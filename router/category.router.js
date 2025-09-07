var router = require('express').Router();

var category = require('./../controller/category.controller')

router.post('/add', category.add);

router.get('/fetch',category.fetch);

router.delete('/deleteimage',category.imageDelete)

router.put('/update',category.update)

router.delete('/delete', category.delete)

//router.delete('/delete',category.delete)

module.exports = router;         
 