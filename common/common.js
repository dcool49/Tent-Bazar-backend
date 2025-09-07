var config = require('./../config');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: config.ACCESS_KEY,
    secretAccessKey: config.SECRET_ACCESS_KEY
});


exports.saveImage = (array, foldername) => {
    try {
        return new Promise((resolve, reject) => {
            var imagename = [];
            var count = 0;
            for (let index = 0; index < array.length; index++) {
                var filename = new Date().getTime().toString() + array[index].name;
                imagename.push({ img_name: filename })
                array[index].mv(foldername + filename, (error) => {
                    if (!error) {
                        count++;
                        if (array.length == count) {
                            resolve(imagename)
                        }
                    }
                })           
            }
        })
    } catch (error) {
        reject(error)
    }
}

exports.manageImageName = (array, foldername) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].image) {
            for (let j = 0; j < array[i].image.length; j++) {
                if (!array[i].image[j].img_name.includes('cataloguebucket')) {
                    array[i].image[j].img_name = 'http://' + config.HOST + ':' + config.PORT + foldername + array[i].image[j].img_name;
            }        
        }
    }
    }
    return array;   
}


exports.manageImageNameForBanner = (array, foldername) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].bannerImage) {
            for (let j = 0; j < array[i].bannerImage.length; j++) {
                if (!array[i].bannerImage[j].img_name.includes('cataloguebucket')) {
                    array[i].bannerImage[j].img_name = 'http://' + config.HOST + ':' + config.PORT + foldername + array[i].bannerImage[j].img_name;
                }
            }        
        }
    }
    return array;   
}


exports.saveImageToS3 = async (array, foldername) => {
    try {
        return new Promise((resolve, reject) => {
            var imagename = [];
            var count = 0;
            for (let index = 0; index < array.length; index++) {
                var filename = new Date().getTime().toString() + array[index].name;
                s3.upload({
                    Bucket: 'cataloguebucket',
                    Key: filename,
                    ContentType: array[index].mimetype,
                    Body: array[index].data
                }, (err, data) => {
                    if (err) {
                        // console.error(err);
                        count++;
                        if (array.length == count) {
                            resolve(imagename)
                        }
                    } else {
                        imagename.push({ img_name: data.Location });
                        count++;
                        if (array.length == count) {
                            resolve(imagename)
                        }
                    }
                });
            }


        })
    } catch (error) {
        reject(error)
    }
}