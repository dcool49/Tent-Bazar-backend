var User = require('./../model/user.model');

    
exports.register=(req,res,next)=>{
        var response = {
            status: false,
            message:"",
            data:[],
            error:null
        }
        if(req.body.mobile && req.body.password && req.body.email && req.body.name)
        {
            var user = new User ({
                name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile, 
                password : req.body.password,
                city:req.body.city,
                pinCode:req.body.pinCode,
                address:req.body.address,
                state:req.body.state,
                companyName:req.body.companyName
            })
            user.save()
            .then((result)=>{
                //res.send({message:'user register successfully', status:true, _id:result._id})
                response.status=true,
                response.message="Registration done successfully";
                response.data = result
                res.send(response)
            })
            .catch((error)=>{
                response.status=true,
                response.message="unable to register";
                response.data = error
                res.send(response)
            })
        }else{
             response.message = "Invalid data"
            res.status(400).send(response);
        }
};


exports.fetch = (req,res,next) =>{
    var response = {
        status : false,
        message : "",
        data : [],
        error : null  
    }
    User.find().select('-password')
    .then((result)=>{
        response.status =true,
        response.message = 'Data Found',
        response.data = result,
        res.send(response)
    })
    .catch((error)=>{
        response.message="data not found",
        response.error=error
        res.send(response)
    })
}




exports.login = (req,res,next)=>{
        var response = {
            status: false,
            message:"",
            data:[],
            error:null
        }
    if(req.body.mobile && req.body.password)
    {
        User.find({
            mobile:req.body.mobile,
            password:req.body.password
        }).then((result)=>{
            console.log(" result ",result);
            if (result.length == 0) {
                response.message='user is not registered please register it first';
                res.send(response)
            }else{
                response.status=true;
                response.message='user login successfully';
                response.data=result
                res.send(response);
                
            }
        })
        .catch((error)=>{
            response.message = "Unable to login";
            response.error = error;         
            res.send(response);
        })
    }else{
        response.message = "Invalid data"
        res.status(400).send(response); 
    }

}

function setadmin() {
  
    User.findOneAndUpdate({mobile : 1111111111,password : 'admin'},{$set:{mobile : 1111111111,password : 'admin',status :'true', role:'admin'}},{upsert : true})
    .then((result)=>{
        console.log(" admin set successfully ",result);
    })
    .catch((err)=>{
        console.log(" unable to set admin ",err);
    })

}
setadmin();
