// var mongoose = require('mongoose');

// var UserNew = mongoose.Schema({
//     name:{type:String},
//     password:{type:String},
//     mobileNumber:{type:String, required:true, unique : true},
//     addressLine:{type:String,default:null},
//     city:{type:String,default:null},
//     state:{type:String,default:null},
//     pinCode:{type:Number,default:null},
//     role: {
//         type:String, 
//         enum :['Admin','Manager','Seller','New'],
//         default:'User'
//     }
// },{
//     timestamps : true
// })

// module.exports=mongoose.model('UserNew', UserNew);