const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.generatePassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            resolve(hash)
        });
    })
}

exports.validatePassword = async (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, result) {
             resolve(result);
        });
    });
}