var Order = require("./../model/order.model");
var User = require("./../model/user.model");
var Product = require("./../model/product.model");
var mongoose = require('mongoose');

exports.add = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    if (req.body.productDetails && req.body.buyerId) {

        new Order(req.body).save()
            .then((result) => {
                response.status = true;
                response.message = 'Order placed successfully';
                response.data = result;
                res.send(response);
            })
            .catch((error) => {
                console.log(" here ");
                response.message = "Unable to place order";
                response.error = error
                res.send(response);

            })

    } else {
        response.message = 'Invalid data';
        res.status(400).send(response);
    }
}


exports.fetch = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    Order.find({}).populate([{path : 'empId', select : "-password"},{path : 'buyerId', select : "-password"},'productDetails.productId'])
        .then((result) => {
            response.status = true,
                response.message = 'Data Found',
                response.data = result,
                res.send(response)
        })
        .catch((error) => {
            response.message = "data not found",
                response.error = error
            res.send(response)
        })
}