var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload')
var fs = require('fs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./router/user.router')
var productRouter=require('./router/product.router')
var categoryRouter= require('./router/category.router')
var bannerRouter = require('./router/banner.router');
var orderRouter = require('./router/order.router');
var config = require('./config');
var common = require('./common/common');
var cors = require('cors')
var app = express();

mongoose.connect("mongodb://localhost:27017/Catelogue",(error,result)=>{
  if (error) {
      console.error(" database connectivity ",error);
  } else {
    console.log(" database connect successfully");
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/category',categoryRouter);
app.use('/api/banner',bannerRouter);
app.use('/api/order',orderRouter);

if (!fs.existsSync('public/ProductImage')) {
    fs.mkdirSync('public/ProductImage')
    
}

if (!fs.existsSync('public/CategoryImage')) {
  fs.mkdirSync('public/CategoryImage')
}
if(!fs.existsSync('public/BannerImage')){
  fs.mkdirSync('public/BannerImage')
}

// app.post("/uplaodfilestest",(req,res,next)=>{
//     var files = req.files.photo;
//     if (!Array.isArray(files)) {
//       files =  [files];

//     }
//     common.saveImage(files,'./public/CategoryImage/')
//     .then((result)=>{
//       console.log(" result ",result);
//     })
//     .catch((error)=>{
//         console.log(" error ",error);
//     })
// })


// app.post('/uploadmultifiles',(req,res,next)=>{
    
//         var files= req.files.mfile
//         let promises = []
    
//         if(!Array.isArray(files))
//         {
//           files = [files];
//         }

//         files.forEach((file) =>{
//            promises.push(file.mv('./'+file.name))
//         })
//         return promises;
//     })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.PORT,()=>{
  console.log("sever is runing at ",config.PORT);
})
module.exports = app;
