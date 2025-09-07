var mongoose= require('mongoose');

var Category = mongoose.Schema({
    categoryName:{type:String},
    image:[{img_name: {type : String}}]
})

module.exports=mongoose.model('Category',Category);