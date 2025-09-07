var mongoose = require('mongoose')

var Banner = mongoose.Schema({
    bannerName :{type: String, require:true},
    bannerImage:[{img_name:{type:String}}]

},{
    timestamps:true
})

module.exports = mongoose.model('Banner',Banner)
