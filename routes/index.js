var express= require("express");
var bodyParser = require("body-parser");
var app        = express();

//var router = express.Router();
var router = express.Router({mergeParams: true});
var passport = require("passport");

var User = require("../models/user");
var flash   = require("connect-flash");
app.use(bodyParser.urlencoded({extended:true}));

//AUTH ROUTES
//show register form
//ROOT ROUTE
router.get("/", function(req,res){
    res.render("landing");
 });

 router.get("/register", function(req,res){
    res.render("register");
 });

 //handle sign up logic
 router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
       if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
            //return res.render("register"); bad one
       }
       passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
       });
    });
  //  res.send("Signing you up...");
 });
 
 //SHOW LOGIN FORM
 router.get("/login", function(req,res){
    //res.render("login", {message: req.flash("error")});
     res.render("login");
 });
 //HANDLING LOGIN LOGIC
 //app.post("/login", middleware, callback)
 router.post("/login", passport.authenticate("local", 
    {
       successRedirect: "/campgrounds",
       failureRedirect: "/login"
    }),  function(req,res){
     // res.send("LOGIN LOGIC HAPPENS HERE");
 });
 //LOGOUT ROUTE
 router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");

   // req.flash("success", "Log you out!");
 });
 
 
 module.exports = router;