var Urls = require("./../model/urls.model");

exports.add = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    if (req.body.url && req.body.type) {
        new Urls(req.body).save()
            .then((result) => {
                response.status = true;
                response.message = 'Urls added successfully';
                response.data = result;
                res.send(response);
            })
            .catch((error) => {
                response.message = "Unable to add Urls";
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
    if (req.query.type) {
        Urls.find({type : req.query.type})
            .then((result) => {
                response.status = true;
                response.message = 'Urls fetch successfully';
                response.data = result;
                res.send(response);
            })
            .catch((error) => {
                response.message = "Unable to fetch Urls";
                response.error = error
                res.send(response);

            })
    } else {
        response.message = 'Invalid data';
        res.status(400).send(response);
    }

}

exports.delete = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    if (req.query.url) {
        Urls.findByIdAndDelete(req.query.url)
            .then((result) => {
                response.status = true;
                response.message = 'Urls deleted successfully';
                response.data = result;
                res.send(response);
            })
            .catch((error) => {
                response.message = "Unable to delete Urls";
                response.error = error
                res.send(response);

            })
    } else {
        response.message = 'Invalid data';
        res.status(400).send(response);
    }

}