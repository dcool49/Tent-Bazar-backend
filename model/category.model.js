var mongoose= require('mongoose');

var Category = mongoose.Schema({
    categoryName:{type:String, unique : true},
    image:[{img_name: {type : String}}],
    rank : { type : Number, default : 10000}
})

module.exports=mongoose.model('Category',Category);