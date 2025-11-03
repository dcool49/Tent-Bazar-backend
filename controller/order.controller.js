var Order = require("./../model/order.model");
var User = require("./../model/user.model");
var Product = require("./../model/product.model");
var mongoose = require('mongoose');
var common = require('./../common/common');

exports.add = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    if (req.body.productDetails && req.body.buyerId) {
        req.body.status = 'TO-DO';
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
    Order.find(req.query).populate([{ path: 'empId', select: ["-password","-passwordToShow"] }, { path: 'buyerId', select: ["-password","-passwordToShow"] }, 'productDetails.productId'])
        .then((result) => {
            response.status = true;
                response.message = 'Data Found';
                response.data= common.manageImageNameForOrder(result,'/ProductImage/');
                res.send(response)
        })
        .catch((error) => {
            response.message = "data not found",
                response.error = error
            res.send(response)
        })
}

exports.update = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    if (req.body._id) {
        const _id = req.body._id;
        Order.findByIdAndUpdate({ _id: _id }, { $set: req.body })
            .then((updateresult) => {
                response.status = true;
                response.message = 'Data update successfully';
                response.data = updateresult
                res.send(response)
            })
            .catch((error) => {
                console.log('am in catch 1', error);
                response.status = false;
                response.message = 'unable to update';
                response.data = error
                res.send(response)
            })
    }
    else {
        response.message = "invalid data";
        res.status(400).send(response);
    }
}