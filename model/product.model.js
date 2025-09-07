var mongoose = require('mongoose');
var category = require('./category.model')


var Product = mongoose.Schema({
    productName:{type:String},
    category_id:{type:mongoose.Types.ObjectId,required:true,refer: category},
    price:{type:String},
    product_selling_price : { type: Number,default:null},
    product_discount_price : { type: Number,default:null},
    summery:{type:String},
    image:[{img_name: {type : String}}]
},{
    timestamps:true
})

module.exports=mongoose.model('Product',Product);