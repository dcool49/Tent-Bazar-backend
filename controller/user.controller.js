var User = require('../model/user.model');
const common = require("../common/encypt");


exports.register = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    }
    if (req.body.mobile && req.body.password && req.body.name && req.body.role) {
        common.generatePassword(req.body.password)
            .then((passwordHash) => {
                var user = new User({
                    name: req.body.name,
                    mobile: req.body.mobile,
                    password: passwordHash,
                    role: req.body.role,
                    city: req.body.city,
                    addressLine: req.body.addressLine,
                    pinCode: req.body.pinCode,
                    address: req.body.address,
                    state: req.body.state
                })
                user.save()
                    .then((result) => {
                        //res.send({message:'user register successfully', status:true, _id:result._id})
                        response.status = true,
                            response.message = "Registration done successfully";
                        response.data = result
                        res.send(response)
                    })
                    .catch((error) => {
                        response.status = false,
                            response.message = "unable to register";
                        response.data = error
                        res.send(response)
                    })
            })
    } else {
        response.message = "Invalid data"
        res.status(400).send(response);
    }
};


exports.fetch = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    }
    User.find().select('-password')
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


exports.login = (req, res, next) => {
    var response = {
        status: true,
        message: 'user login successfully',
        data: [],
        error: null
    }
    res.send(response);

    // if (req.body.mobile && req.body.password) {
    //     User.find({
    //         mobile: req.body.mobile,
    //         password: req.body.password
    //     }).then((result) => {
    //         console.log(" result ", result);
    //         if (result.length == 0) {
    //             response.message = 'user is not registered please register it first';
    //             res.send(response)
    //         } else {
    //             response.status = true;
    //             response.message = 'user login successfully';
    //             response.data = result
    //             res.send(response);

    //         }
    //     })
    //         .catch((error) => {
    //             response.message = "Unable to login";
    //             response.error = error;
    //             res.send(response);
    //         })
    // } else {
    //     response.message = "Invalid data"
    //     res.status(400).send(response);
    // }

}


exports.loginNew = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    }
    if (req.body.mobile && req.body.password) {
        User.find({
            mobile: req.body.mobile
        }).then((result) => {
            if (result.length == 0) {
                response.message = 'user is not registered please register it first';
                res.send(response)
            } else {
                common.validatePassword(req.body.password, result[0].password)
                    .then((passwordStatus) => {
                        if (passwordStatus) {
                            response.status = true;
                            response.message = 'user login successfully';
                            response.data = result
                            res.send(response);
                        } else {
                            response.status = false;
                            response.message = 'Invalid username or password';
                            res.send(response);
                        }
                    })
            }
        }).catch((error) => {
            response.message = "Unable to login";
            response.error = error;
            res.send(response);
        })
    } else {
        response.message = "Invalid data"
        res.status(400).send(response);
    }
}

exports.update = async (req, res, next) => {
    // 1. Initialize the response object
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };

    // 2. Check if a valid ID is provided
    if (!req.body._id || !req.body) {
        response.message = "Invalid or missing user ID.";
        return res.status(400).send(response);
    }

    // 3. Store the ID before deleting it from the request body
    const userId = req.body._id;

    // 4. Safely delete sensitive or unnecessary fields from the body
    delete req.body.password;
    delete req.body.mobile;
    delete req.body._id;
    delete req.body.role;

    try {
        // 5. Perform the update with the `{ new: true }` option
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { pinCode: req.body.pinCode } },
            { new: true } // Return the updated document
        );

        // 6. Check if a document was found and updated
        if (!updatedUser) {
            response.message = 'User not found.';
            return res.status(404).send(response);
        }

        // 7. Send a successful response with the updated document
        response.status = true;
        response.message = 'Data updated successfully.';
        response.data = updatedUser;
        res.status(200).send(response);
    } catch (error) {
        // 8. Handle any database or validation errors
        response.status = false;
        response.message = 'Unable to update user.';
        response.error = error;
        res.status(500).send(response);
    }
};

exports.validateUser = async (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    };
    const { mobile, name } = req.body;
    if (!mobile) {
        response.message = 'Mobile number is required.'
        res.send(response);
        return
    }
    try {
    // 2. Define the filter and update data for the upsert
    // The filter finds a user by mobile number.
    const filter = { mobile: mobile };
    
    // The update defines the data for a new record if it needs to be created.
    // Use $set to only update or set specified fields.
    const update = { $set: { mobile: mobile } };

    // You can add other fields from req.body if desired.
    if (name) {
      update.$set.name = name;
    }
    
    // 3. Set the upsert and new options for findOneAndUpdate
    const options = {
      upsert: true, // Creates the document if it doesn't exist
      new: true,    // Returns the newly created or updated document
      runValidators: true // Ensures schema validation runs on the update
    };

    // 4. Perform the "find or create" operation
    const user = await User.findOneAndUpdate(filter, update, options);

    // 5. Send a successful response with the user's _id
    response.status = true;
    response.message = 'Operation successful.';
    response.data = { _id: user._id };
    res.status(200).send(response);

  } catch (error) {
    // 6. Handle potential errors, such as a duplicate key violation
    if (error.code === 11000) {
      response.message = 'Mobile number already exists.';
      response.error = error;
      return res.status(409).send(response); // Use 409 Conflict for resource conflict
    }

    // 7. Handle other server-side errors
    console.error('Error in validateOrCreate:', error);
    response.message = 'Internal server error.';
    response.error = error;
    res.status(500).send(response);
  }

}

async function setadmin() {
    common.generatePassword("admin1234")
        .then((passresult) => {
            User.findOneAndUpdate({ mobile: 1111111111 }, { $set: { mobile: 1111111111, password: passresult, status: 'true', role: 'admin' } }, { upsert: true })
                .then((result) => {
                    console.log(" admin set successfully ", result);
                })
                .catch((err) => {
                    console.log(" unable to set admin ", err);
                })
        })

}
setadmin();
