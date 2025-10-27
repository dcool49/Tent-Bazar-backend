var mongoose= require('mongoose');

var Category = mongoose.Schema({
    categoryName:{type:String, unique : true},
    image:[{img_name: {type : String}}],
    rank : { type : Number, default : 10000},
    status : { type : String, default : 'Active'}
})

module.exports=mongoose.model('Category',Category);