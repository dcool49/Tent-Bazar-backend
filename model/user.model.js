var mongoose = require('mongoose');

var User = mongoose.Schema({
    name:{type:String},
    email:{type:String},
    companyName:{type:String,default:null},
    password:{type:String, required:true},
    address:{type:String},
    addressLine:{type:String,default:null},
    addressLine2:{type:String,default:null},
    city:{type:String,default:null},
    state:{type:String,default:null},
    pinCode:{type:Number,default:null},
    country:{type:String,default:null},
    mobile:{type:Number, required:true},
    role: {
        type:String, 
        enum :['admin','user'],
        default:'user'
    },
    profile_pic:{ type:String }
},{
    timestamps : true
})

module.exports=mongoose.model('User', User);