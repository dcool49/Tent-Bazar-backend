// var User = require('../model/user_New.model');
const common = require("../common/encypt");




// exports.register = async (req, res, next) => {
//     var response = {
//         status: false,
//         message: "",
//         data: [],
//         error: null
//     }
//     if (req.body.mobileNumber && req.body.password && req.body.name && req.body.role) {
//         common.generatePassword(req.body.password)
//             .then((passwordHash) => {
//                 var user = new User({
//                     name: req.body.name,
//                     password: passwordHash,
//                     mobileNumber: req.body.mobileNumber,
//                     addressLine: req.body.addressLine,
//                     city: req.body.city,
//                     state: req.body.state,
//                     pinCode: req.body.pinCode,
//                     role: req.body.role
//                 })
//                 user.save()
//                     .then((result) => {
//                         response.status = true,
//                             response.message = "Registration done successfully";
//                         response.data = result
//                         res.send(response)
//                     }).catch((error) => {
//                         response.status = true,
//                             response.message = "unable to register";
//                         response.data = error
//                         res.send(response)
//                     })
//             })


//     } else {
//         response.message = "Invalid data"
//         res.status(400).send(response);
//     }
// };


// exports.fetch = (req, res, next) => {
//     var response = {
//         status: false,
//         message: "",
//         data: [],
//         error: null
//     }
//     User.find().select('-password')
//         .then((result) => {
//             response.status = true,
//                 response.message = 'Data Found',
//                 response.data = result,
//                 res.send(response)
//         })
//         .catch((error) => {
//             response.message = "data not found",
//                 response.error = error
//             res.send(response)
//         })
// }


// exports.login = (req, res, next) => {
//     var response = {
//         status: false,
//         message: "",
//         data: [],
//         error: null
//     }
//     if (req.body.mobileNumber && req.body.password) {
//         User.find({
//             mobileNumber: req.body.mobileNumber
//         }).then((result) => {
//             if (result.length == 0) {
//                 response.message = 'user is not registered please register it first';
//                 res.send(response)
//             } else {
//                 common.validatePassword(req.body.password, result[0].password)
//                     .then((passwordStatus) => {
//                         if (passwordStatus) {
//                             response.status = true;
//                             response.message = 'user login successfully';
//                             response.data = result
//                             res.send(response);
//                         } else {
//                             response.status = false;
//                             response.message = 'Invalid username or password';
//                             res.send(response);
//                         }
//                     })
//             }
//         }).catch((error) => {
//             response.message = "Unable to login";
//             response.error = error;
//             res.send(response);
//         })
//     } else {
//         response.message = "Invalid data"
//         res.status(400).send(response);
//     }
// }

// async function setadmin() {
//     common.generatePassword("admin1234")
//         .then((result) => {
//             User.findOneAndUpdate({ mobileNumber: '1111111111' }, { $set: { mobileNumber: '1111111111', password: result, status: 'true', role: 'Admin' } }, { upsert: true })
//                 .then((result) => {
//                     console.log(" admin set successfully ", result);
//                 })
//                 .catch((err) => {
//                     console.log(" unable to set admin ", err);
//                 })
//         })
// }
// setadmin();
