var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Order = mongoose.Schema({
    productDetails :[{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        },
        quantity : {
            type : Number
        }
    }],
    orderId: {
        type: Number
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status : {
        type:String, 
        enum :['TO-DO','In-progress','Done','Cancle','Hold'],
        default:'TO-DO'
    },
    Description : {
        type : String
    },
    closingDate : {
        type :  String,
        value : new Date().toISOString()
    },
     addressLine : {
        type : String
    },
     city : {
        type : String
    },
     state : {
        type : String
    },
    pinCode : {
        type : Number
    }
}, {
    timestamps: true
})

Order.plugin(AutoIncrement, { inc_field: 'orderId' });

module.exports = mongoose.model('Order', Order);