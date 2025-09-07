var Banner = require('./../model/banner.model')
var common = require('./../common/common');
var fs = require('fs')
exports.add = (req,res,next)=>{
    var response = {
        status:false,
        message:'',
        data:[],
        error:null
    }
    if(req.body.bannerName && req.files && req.files.files)
    {
            console.log(' -- ');
        var files = req.files.files;
        if (!Array.isArray(files)) {
          files =  [files];
        }
        if (files.length == 1) {
            common.saveImageToS3(files,'./public/BannerImage/')
            .then((result)=>{
                console.log('first',result);
                new Banner({
                    bannerName:req.body.bannerName,
                    bannerImage:result
                }).save()
                .then((result1)=>{
                    console.log("second");
                    response.status=true;
                    response.message='banner images added successfully';
                    response.data=result1;
                    res.send(response);
                })
                .catch((error)=>{
                    console.log(" third ");
                    response.message="Unable to add Baer";
                    response.data=error
                    res.send(response);
        
                })
            })
            .catch((error)=>{
                response.message="Unable to add banner";
                response.error=error;
                res.send(response);
            })
            
        } else {
            response.message='Invalid userid';
            res.status(400).send(response);
        }
    
    }else{
        response.message='Invalid userid';
        res.status(400).send(response);
    }
}

exports.delete = (req,res,next)=>{
    var response = {
        status:false,
        message:'',
        data:[],
        error:null
    }
    if (req.query._id) {
        _id = req.query._id
         Banner.findByIdAndDelete(_id)
        .then((result)=>{

                fs.unlinkSync('public/BannerImage/'+ result.bannerImage[0].img_name,(err)=>{
                        console.log(' err ',err);
                        console.log("image deleted successfully");
                       // response.message = "Banner deleted successfully";
                      })
                       response.message = "Banner deleted successfully";
                       response.status = true;  
                       res.send(response)
                    })
        .catch((err)=>{
            console.log('err0',err);
            response.message = "Unable to delete banner";
            response.error = err;
            res.status(500).send(response)
        })
        
    } else {
        res.status(400).send({message : "Invalid data", status : false})
    }
}

exports.fetch = (req,res,next)=>{
    var response = {
        status:false,
        message:'',
        data:[],    
        error:null
    }
    Banner.find()
    .then((result)=>{
        response.data= common.manageImageNameForBanner(result,'/BannerImage/');
        if (response.data.length) {
            response.status=true;
            response.message="Data found successfully";
        }else{
            response.message="Data not found";
        }
        res.send(response);
    })
    .catch((error)=>{
        response.status=false
        response.message="Data doesn't found";
        response.error=error
        res.send(response);
    })
}


