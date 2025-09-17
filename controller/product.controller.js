var Product = require("./../model/product.model");
var mongoose = require('mongoose');
var common = require('./../common/common');
var fs = require('fs');
const categoryModel = require("../model/category.model");

exports.add = (req,res,next)=>{
    var response = {
        status: false,
        message:"",
        data:[],
        error:null
    }
    if(req.body.productName && req.body.category_id && req.body.price)
    {
        if(req.files && req.files.files)
        {
            var files = req.files.files;
            if (!Array.isArray(files))
             {
              files =  [files];
             }
            common.saveImageToS3(files,'./public/ProductImage/')
            .then((result2)=>{
                console.log(" === 798798== ",result2);
                new Product({
                    category_id:mongoose.Types.ObjectId(req.body.category_id),
                    productName:req.body.productName,
                    price:req.body.price,
                    summery:req.body.summery,
                    product_selling_price:req.body.product_selling_price,
                    product_discount_price:req.body.product_discount_price,
                    image : result2
                }).save()
                .then((result)=>{
                    response.status=true;
                    response.message='product added successfully';
                    response.data=result;
                    res.send(response);
                })
                .catch((error)=>{
                    console.log(" here ");
                    response.message="Unable to add product";
                    response.error=error
                    res.send(response);
    
                })
            })
            .catch((error)=>{
                console.log("===check",error);
                response.message="Unable to add productff";
                response.error=error;
                res.send(response);
            })
        }
        else
        {
            new Product({
                category_id:mongoose.Types.ObjectId(req.body.category_id),
                productName:req.body.productName,
                price:req.body.price,
                summery:req.body.summery,
                product_selling_price:req.body.product_selling_price,
                product_discount_price:req.body.product_discount_price,
              
            }).save()
            .then((result)=>{
                console.log(" here 1");
                response.status=true;
                response.message='product added successfully';
                response.data=result;
                res.send(response);
            })
            .catch((error)=>{
                console.log(" here ");
                response.message="Unable to add product";
                response.error=error
                res.send(response);

            })
        }

    }

    else{
        response.message='Invalid userid';
        res.status(400).send(response);
    }
}

exports.fetch = (req,res,next)=>{      
                                                                                         
    var response = {
        status:false,
        message:"",
        data: [],
        error:null,
    }
  
        var dynamicQuery = {};
        if (req.query.category_id) {
            dynamicQuery.category_id = req.query.category_id;
        }
        if (req.query.search) {
            dynamicQuery.productName = {$regex:  req.query.search, $options: 'i'};
        }
    Product.find(dynamicQuery)
    .then((result)=>{
    //     console.log(" ==== ",common.manageImageName(JSON.parse(JSON.stringify(result)),'/ProductImage/'));
    //    response.data= common.manageImageName(JSON.parse(JSON.stringify(result)),'/ProductImage/');
       response.data= common.manageImageName(result,'/ProductImage/');
        response.status=true;
        response.message="Data found successfully";
        
        res.send(response);
    })
    .catch((error)=>{
        console.log('error', error);
        response.status=false
        response.message="Data doesn't found";
        response.error=error
        res.send(response);
    })   

}

exports.update=(req,res,next)=>{
        var response={
            status:false,
            message:"",
            data: [],
            error:null
        }
        if(req.body._id)
        {
             Product.findByIdAndUpdate(req.body._id,{$set :{productName:req.body.productName,price:req.body.price,summery:req.body.summery,product_selling_price:req.body.product_selling_price,product_discount_price:req.body.product_discount_price}})
            .then((result1)=>{
                response.status=true;
                response.message="Data updated Successfully";
                response.data=result1;
                res.send(response);
            })
            .catch((error)=>{
                response.status=false;
                response.message='unable to update';
                response.error=error
                res.send(response);
            })
        }else{
            response.message="invalid data",
            res.status(400).send(response)
        }
}


exports.fetchbyid=(req,res,next)=>{
    var response={
        status:false,
        message:'',
        data:[],
        err:null
    }  

    if (req.query._id) {
      Product.findById(req.query._id)
      // Product.find({_id:mongoose.Types.ObjectId(req.query._id)}).populate([{ path:'category_id',model:categoryModel,Select:'categoryName'}])  
        .then((result)=>{
            console.log('result',result);
            response.status=true;
            response.message='product detials found successfully';
            response.data = common.manageImageName([result],'/ProductImage/');
            res.send(response)
        })
        .catch((err)=>{
            response.status=false;
            response.message='unable to found details';
            response.data = err;
            res.send(response)
            
        })
    }
    else{
        response.message="invalid data";
        res.status(400).send(response);
    }
    
}

exports.imageUpdate =(req,res,next)=>{
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
          common.saveImageToS3(files,'./public/ProductImage/')
          .then((result)=>{
            console.log(' result ',result);
            Product.findByIdAndUpdate({_id:req.body._id},{$push:{image:result}})
            .then((updateresult) =>{
                response.status=true;
                response.message='image update successfully';
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


exports.imageDelete = (req,res,next) => {
    var response = {
        
        status:false,
        message:'',
        data:[],
        err:null
    }
    if(req.query.product_id  && req.query.image_id)
    {
        product_id=req.query.product_id;
        image_id=req.query.image_id
        console.log('===proid',product_id);
        console.log('imageid',image_id);
        Product.findById(product_id)
        .then((result)=>{
            let imagename;
            console.log('result==', result);
            for (let i = 0; i <  result.image.length; i++) {
                console.log(" ====imageid ",result.image[i]._id);
                if(image_id == result.image[i]._id)
                {
                    imagename=result.image[i].img_name
                }
            }
           // console.log('imgname',imagename);
            //rewmove database 
            // remove i.e unlink

            if (imagename) {
            Product.update({_id : mongoose.Types.ObjectId(product_id)},{$pull:{image:{_id : image_id }}},(error,result)=>{
                console.log(error, '=====',result);
                if(!error)
                {
                        fs.unlinkSync('public/ProductImage/'+imagename,(error)=>{
                            console.log(' error ',error);
                        });
                        response.status=true;
                        response.message='file deleted successfully';
                        res.send(response);
                        
                    }
                })
            }else{
                response.message='Unable to deleted';
                res.send(response);
            }


            // Product.findByIdAndUpdate(product_id,{$pull:{image:{_id : image_id }}},(error,result)=>{
            //     console.log(error, '=====',result);
            // })
            
        })
        .catch((error)=>{
                response.status=false;
                response.message='unable to delete';
                response.data=error;
                res.send(400)
        })
    }
    else{
            
        response.message="invalid data";
        res.status(400).send(response);
    }

}



exports.delete = (req,res,next)=>{
    var response ={
        status:false,
        message:'',
        data:[],
        error:null
    }
    if (req.query._id) {
        Product.findByIdAndDelete(req.query._id)
        .then((result)=>{
            response.status=true;
            response.message='product deleted successfully';
            response.data = result;
            res.send(response);
        })
        .catch((error)=>{
                    response.status=false
                    response.message="Data doesn't found";
                    response.error=error
                    res.send(response);
        })
        
    } else {
        response.message="invalid data",
        res.status(400).send(response)
    }
}
























// exports.delete=(req,res,next)=>{
//     var response = {
//         status : false,
//         message : "",
//         data : [],
//         error : null
//     }


// if(req.query._id)
// {
//     Product.findByIdAndDelete(req.query._id)
//     .then((result)=>{
//         response.status=true
//         response.message="data is successfully deleted";
//         res.send(response)
//     })
//     .catch((error)=>{
//         response.message="unablle to delete",
//         response.error=error,
//         res.send(response)
//     })
// }else{
//     response.message="invalid data",
//     res.status(400).send(response);
// }
// }

// exports.add = (req,res,next) =>{
//     var response = {
//         status : false,
//         message: "",
//         data : [],
//         error: null
//     };
//     console.log("checking ", req.body);
//     if(req.body.Product_name && req.body.user_id && req.body.category){
//         var product = new Product({
//            Product_name: req.body.Product_name,
//             user_id:req.body.user_id,
//             category: req.body.category
//         })
//         product.save()
//         .then((result)=>{
//             response.status = true,
//             response.message = "product added succefully",
//             response.data=result
//             res.send(response)
//         })
//         .catch((error)=>{
//             response.message = "unable to add",
//             response.error = error,
//             res.send(response)
//         })
//     }else{
//         response.message = "invalid data",
//         res.status(400).send(response);
//     }
// };
 