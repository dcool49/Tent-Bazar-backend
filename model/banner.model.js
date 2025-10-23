var mongoose = require('mongoose')

var Banner = mongoose.Schema({
    bannerName :{type: String, require:true},
    bannerImage:[{img_name:{type:String}}],
    rank : { type : Number, default : 10000}
},{
    timestamps:true
})

module.exports = mongoose.model('Banner',Banner)
