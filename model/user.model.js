var mongoose = require('mongoose');

var User = mongoose.Schema({
    mobile:{type:Number, required:true,unique : true},
    name:{type:String},
    password:{type:String},
    companyName:{type:String,default:null},
    address:{type:String},
    addressLine:{type:String,default:null},
    city:{type:String,default:null},
    state:{type:String,default:null},
    pinCode:{type:Number,default:null},
    role: {
        type:String, 
        enum :['admin','user','manager','seller'],
        default:'user'
    }
},{
    timestamps : true
})

module.exports=mongoose.model('User', User);