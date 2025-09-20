const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const Url = mongoose.Schema({
        url : {
            type :String,
            require : true
        },
        type : {
            type : String,
            require : true   
        }
},{
    timestamps:true
});

module.exports = mongoose.model('Url',Url)