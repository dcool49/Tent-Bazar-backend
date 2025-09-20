var Category = require('./../model/category.model');
var common = require('./../common/common');

var fs = require('fs')


exports.add = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    }
    if (req.body.categoryName) {

        if (req.files && req.files.files) {
            var files = req.files.files;
            if (!Array.isArray(files) == 1) {
                files = [files];
            }
            common.saveImageToS3(files, './public/CategoryImage/')
                .then((result1) => {
                    console.log(" === 798798== ", result1);
                    new Category({
                        categoryName: req.body.categoryName,
                        image: result1
                    }).save()
                        .then((result) => {
                            console.log(" here 1");
                            response.status = true;
                            response.message = 'Category selected successfully';
                            response.data = result;
                            res.send(response);
                        })
                        .catch((error) => {
                            console.log(" here ");
                            response.message = "Unable to add category";
                            response.error = error
                            res.send(response);

                        })
                })
                .catch((error) => {
                    response.message = "Unable to add category";
                    response.error = error;
                    res.send(response);
                })

        } else {
            new Category({
                categoryName: req.body.categoryName
            }).save()
                .then((result) => {
                    console.log(" here 1");
                    response.status = true;
                    response.message = 'Category selected successfully';
                    response.data = result;
                    res.send(response);
                })
                .catch((error) => {
                    console.log(" here ");
                    response.message = "Unable to add category";
                    response.error = error
                    res.send(response);

                })
        }

    }
    else {
        response.message = 'Invalid userid';
        res.status(400).send(response);
    }
}

exports.fetch = (req, res, next) => {
    var response = {
        status: false,
        message: "",
        data: [],
        error: null
    }
    Category.find()
        .then((result) => {

            response.data = common.manageImageName(result, '/CategoryImage/');

            response.status = true;
            response.message = "Data found successfully";
            res.send(response);
        })
        .catch((error) => {
            response.status = false
            response.message = "Data doesn't found";
            response.error = error
            res.send(response);
        })
}

exports.update = (req, res, next) => {
    var response = {

        status: false,
        message: '',
        data: [],
        err: null
    }
    if (req.body._id && req.body.categoryName) {
        Category.findByIdAndUpdate({ _id: req.body._id }, { $set: { categoryName: req.body.categoryName } })
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

exports.delete = (req, res, next) => {
    var response = {
        status: false,
        message: '',
        data: [],
        error: null
    }

    if (req.query._id) {

        Category.findByIdAndDelete(req.query._id)
            .then((result) => {

                response.status = true;
                response.message = 'Category and all product are related to this category suceesfully';
                response.data = result;
                res.send(response);
            })
            .catch((error) => {
                response.status = false
                response.message = "Data doesn't found";
                response.error = error
                res.send(response);
            })

    } else {
        response.message = "invalid data",
            res.status(400).send(response)
    }
}

exports.imageDelete = (req, res, next) => {
    var response = {

        status: false,
        message: '',
        data: [],
        err: null
    }
    if (req.query.category_id && req.query.image_id) {
        category_id = req.query.category_id;
        image_id = req.query.image_id
        console.log('===proid', category_id);
        console.log('imageid', image_id);
        Category.findById(category_id)
            .then((result) => {
                let imagename;
                console.log('result==', result);
                for (let i = 0; i < result.image.length; i++) {
                    console.log(" ====imageid ", result.image[i]._id);
                    if (image_id == result.image[i]._id) {
                        imagename = result.image[i].img_name
                    }
                }
                // console.log('imgname',imagename);
                //rewmove database 
                // remove i.e unlink

                if (imagename) {
                    Category.findByIdAndUpdate(category_id, { $pull: { image: { _id: image_id } } }, (error, result) => {
                        console.log(error, '=====', result);
                        if (!error) {
                            fs.unlinkSync('public/CategoryImage/' + imagename, (error) => {
                                console.log(' error ', error);
                            });
                            response.status = true;
                            response.message = 'file deleted successfully';
                            res.send(response);

                        }
                    })
                } else {
                    response.message = 'Unable to deleted';
                    res.send(response);
                }


                // Product.findByIdAndUpdate(product_id,{$pull:{image:{_id : image_id }}},(error,result)=>{
                //     console.log(error, '=====',result);
                // })

            })
            .catch((error) => {
                response.status = false;
                response.message = 'unable to delete';
                response.data = error;
                res.send(response)
            })
    }
    else {

        response.message = "invalid data";
        res.status(400).send(response);
    }

}

exports.updateImage =(req,res,next)=>{
    var response = {
        
        status:false,
        message:'',
        data:[],
        err:null
 }
 if(req.body._id && req.files && req.files.files)
    {
    
        var files = req.files.files;
        if (!Array.isArray(files)) { 
            files =  [files];
        }
          common.saveImageToS3(files,'./public/CategoryImage/')
          
          .then((result)=>{
          
            console.log(' result ',result);
            if(result.length==1)
            {
                
             Category.findByIdAndUpdate({_id:req.body._id},{$set:{image:result}})
             .then((updateresult) =>{
                response.status=true;
                response.message='Data update successfully';
                response.data=updateresult
                res.send(response)
            })
            .catch((error)=>{
                console.log('am in catch 1',error);
                response.status=false;
                response.message='unable to update';
                response.data=error
                res.send(response)
         })
        }
        else{
    
            response.status=false;
            response.message='only one image';
            res.send(response)
        }
     })
     
     .catch((error)=>{
            console.log('am in catch 2',error);
            response.status=false;
            response.message='unable to update';
            response.data=error
            res.send(response);
        })
     }
     
     else{
        response.message="invalid data";
        res.status(400).send(response);
    }
}