var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var distance = require('google-distance');

mongoose.connect('localhost:27017/test2');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  UserName: {type: String, required: true},
  Password: String,
  Email: String
}, {collection: 'user-data'});
/*=======================================================*/
var hubsInfo = new Schema({
  TruckType: {type: String, required: true},
  City: String,
  Availability: String,
  Date : Date,
  Time : String
}, {collection: 'Hubs-Info'});

var productDataSchema = new Schema({
  ItemName : {type: String, required: true},//name of image. Anuything has required property in DB should have prop of required in HTML
  ImageLink: String,//currently we post only http link, but in the futture we should import image using file dialog.
  Descrip : String,
  PosterId : String,//the user who post that image this field should be hidden and take its value from the logged user
  Model : String,
  ItemCode : Number,
  likes : Number,// number likes that image got
  InitialBid:Number,
  CurrentBid : Number,
  BidHistory : Number,//this should be a hidden field that count number of bids
  MinimumBid: Number,
  OpenDate : Date,
  CloseDate : Date,
  Features : String,
  Warranty : String,
  Returns : String,
  Shipping : String,
  ShippingOptions : String,
  Payment : String

}, {collection: 'product-data'});

var UserData = mongoose.model('UserData', userDataSchema);
var ProductData = mongoose.model('ProductData', productDataSchema);
var HubsInfo = mongoose.model('HubsInfo', hubsInfo);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/insert', function(req, res, next) {
  var item = {
    TruckType: req.body.UserName,
    City: req.body.Password,
    Availability: req.body.Ava,
    Date : req.body.Date,
    Time: req.body.Time
  };
  var data = new HubsInfo(item);
  console.log(data);
  data.save();
  res.redirect('/');
});
router.get('/newindex', function(req, res, next) {
  res.render('newindex');
});
router.post('/information', function(req, res, next) {
console.log('heeeeeeeeeeeeeee');
var requestedSite=req.body.origin;
var destination = req.body.destination;
var date = req.body.date;
var type = req.body.typeofload;
console.log("haaaaaaaaaaaaaaa",type);
var i=0;
var min=4294967295;
console.log(typeof(min));
HubsInfo.distinct('City',{Availability:'1',TruckType:`${type}`},(err,result)=>{
  console.log(result, type);
  var i=0;
  var origincity;
  var destination;
  var duration;
for(i=0;i<result.length;i++){
  distance.get(
    {
      origin: requestedSite,
      destination: result[i]
    },
    function(err, data) {
      if (err) return console.log(err);
      //min=Math.min(min,parseInt(data.distanceValue))
      var z=parseInt(data.distanceValue);
      console.log(typeof(z), z);
       if(min>z){
       min=parseInt(data.distanceValue);
        origincity=data.origin;
        destination=data.destination;
        duration= data.duration;
     }
      console.log("min============",min);
  });}
setTimeout(() => {
  console.log("======================================================");
  console.log('The minimum distance a drivers can go is '+min+' starts');
  console.log('from '+origincity+' and ends in '+destination+' within '+duration);
  console.log("======================================================");
}, 1000);
  

});
// HubsInfo.find().forEach( function(obj)
// {console.log(obj.City);});

// distance.get(
//   {
//     origin: requestedSite,
//     destination: HubsInfo.City+", "+HubsInfo.State
//   },
//   function(err, data) {
//     if (err) return console.log(err);
//     console.log(data);
// });
 res.render('newindex');
});

router.get('/shopping', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('shoplist', {productitems: doc});
      });
});
router.get('/login', function(req, res, next) {
  res.render('login');
});
router.get('/main-page', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('design', {productitems: doc});
});
});
router.get('/xx', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('testdiv', {productitems: doc});
});
});
// var x='';
// ProductData.findOne({'ItemName' : '4-Burner Propane Gas Grill in Black with Stainless Steel Control Panel'}, function(err,product) {
//   if(err){
//   console.error('error, no entry found');}
//   if(product !=null)
//   {
//    x=product.InitialBid;
//   console.log("hhshshshshshshshhshshshshshsshhshssh:"+ x);
// }});
router.get('/main', function(req, res, next) {
  //when I run this page I want to check the number likes this image got
  res.render('main',{likes:x});
});
router.get('/get-userdata', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('index', {userdata: doc});
      });
});
router.get('/get-productdata', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('index', {productitems: doc});
      });
});

router.post('/post-page', function(req, res, next) {
      var id = req.body.postid;
        ProductData.findById(id, function(err, product) {//to display the name of current logged user. if no one found we should post login button.
            if (err) {
              console.error('error, no entry found');
            }
            res.render('main', {productitems: product});
          });

});
router.get('/allposts', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('posts', {productitems: doc});
      });
});
router.get('/test-allposts', function(req, res, next) {
  ProductData.find()
      .then(function(doc) {
        res.render('test', {productitems: doc});
      });
});

//
// router.post('/insert', function(req, res, next) {
//   var item = {
//     UserName: req.body.UserName,
//     Password: req.body.Password,
//     Email: req.body.Email
//   };
//
//   var data = new UserData(item);
//   data.save();
//
//   res.redirect('/');
// });
//inserting into the product table
router.post('/insert2', function(req, res, next) {
  var item = {
    ItemName : req.body.ItemName,//name of image
    ImageLink: req.body.ImageLink,//currently we post only http link, but in the futture we should import image using file dialog.
    Descrip : req.body.Descrip,
    Model : req.body.Model,
    ItemCode : req.body.ItemCode,
    InitialBid : req.body.InitialBid,
    CurrentBid : req.body.InitialBid,
    MinimumBid: req.body.InitialBid+1,
    OpenDate : req.body.OpenDate,
    CloseDate : req.body.CloseDate
  };

  var data = new ProductData(item);
  data.save();

  res.redirect('/');
});
//Registration in the future
// router.post('/login-process', function(req, res, next) {
//   var item = {
//     title: req.body.uname,
//     content: req.body.psw,
//     author: 'me'
//   };
//
//   var data = new UserData(item);
//   data.save();
//
//   res.redirect('/');
// });
router.post('/login-process', function(req, res, next) {
  var uname = req.body.uname;
  var psw = req.body.psw;
  UserData.findOne({'UserName' : uname, 'Password': psw }, function(err,user) {
    if(err){
      console.error('error, no entry found');}// this error message should be sent to html to show msg box with error not login
  //i do not know why the node does not fire error with user data ==null
    if(user !=null){
  //we call this function to get number of likes and send it to post page
      ProductData.findOne({'ItemName' : '4-Burner Propane Gas Grill in Black with Stainless Steel Control Panel'}, function(err, product) {
        if (err) {
          console.error('error, no entry found');
                }
        if(product !=null)
        {
  //the best solution to have a post id where u can get anything related to that post
 //we send data to the page "main"
         res.render('main',{
           productitems : product,
           userinfo:user
           // user : user.UserName,
           // userid : user._id,
           // CurrentBid : product.CurrentBid,
           //MinimumBid : product.MinimumBid,
           // imagesrc : product.ImageLink,
           // Descrip : product.Descrip,
           // ItemName : product.ItemName,
           // Model : product.Model,
           // ItemCode : product.ItemCode,
           // OpenDate : product.OpenDate,
           // CloseDate : product.CloseDate
       })
         }
       });
     }
 else {
   console.log("error no entry");
   res.redirect('/login')
 }

});
});


router.post('/bid-update', function(req, res, next) {
  var userid = req.body.userid;
  var productid= req.body.productid;
  // console.log("hellllllllllllllllllllllllllo:  " + id);

  ProductData.findById(productid, function(err, product) {
    if (err) {
      console.error('error, no entry found');
    }
    if(product !=null){
      UserData.findById(userid, function(err, user) {//to display the name of current logged user. if no one found we should post login button.
        if (err) {
          console.error('error, no entry found');
        }
        var newbid= req.body.bid;
        if(newbid>=product.MinimumBid)
        {
          product.CurrentBid=newbid;
          product.MinimumBid=product.CurrentBid+1;
          console.log('you bidded successfuly');
          product.save();
          res.render('main',{
            productitems:product,
            userinfo:user,
            // user: user.UserName,
            // userid: user._id,
            // CurrentBid : product.CurrentBid,
            // MinimumBid:product.MinimumBid,
            // imagesrc:product.ImageLink,
            // Descrip : product.Descrip,
            // ItemName : product.ItemName,
            // Model : product.Model,
            // ItemCode : product.ItemCode,
            // OpenDate : product.OpenDate,
            // CloseDate : product.CloseDate
          })
        }
        else
        {
          res.render('main',{productitems:product, userinfo:user,
            //user: user.UserName,
            //userid: user._id,
            // CurrentBid : product.CurrentBid,
            // MinimumBid:product.MinimumBid,
            // imagesrc:product.ImageLink,
            // Descrip : product.Descrip,
            // ItemName : product.ItemName,
            // Model : product.Model,
            // ItemCode : product.ItemCode,
            // OpenDate : product.OpenDate,
            // CloseDate : product.CloseDate,
            error: '--> The Minimum bidding Amount is: '+product.MinimumBid
          })
          console.log('--> Please Enter Amount Greater Than: '+product.MinimumBid);
    }
  })}
});
});
router.post('/update', function(req, res, next) {
  var id = req.body.id;

  UserData.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.UserName = req.body.title;
    doc.Password = req.body.content;
    doc.Email = req.body.author;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
