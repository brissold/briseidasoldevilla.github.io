var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var flash      = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

/*REQUIRING ROUTES*/ 
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

//var Comments = require("./models/comment");
//var User = require("./models/user");

mongoose.connect("mongodb://localhost/yelp_camp_v12");
//tell express to serve the content of public dir
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(methodOverride("_method"));
app.use(flash());
/*SEED THE DATABASE*/
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Once again Rusty wins cutest dog!",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   //res.locals.message = req.flash("error");
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
/*SCHEMA*/

/*Campground.create({
     name: "Granite Hill", 
     image: "https://cdn.pixabay.com/photo/2018/12/24/22/19/camping-3893587_1280.jpg",
     description: "this is a huge granite hill, no baths, no water, beautiful granite!"

}, function(err, campground){
   if(err){
      console.log(err);
   }
   else{
      console.log("NEWLY CREATED CAMPGROUND: ")
      console.log(campground);
   }
});*/



var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Yelpcamp Has Started!");
});