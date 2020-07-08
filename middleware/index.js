//ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};
var Campground= require("../models/campground");
var Comment= require("../models/comment");


middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                // res.redirect("/campgrounds");
                req.flash("error", "Campground not found");
                res.redirect("/");
            }
            else{
                //does user own the campground
                //if (campground.author.id === req.user._id)
                if(foundCampground.author.id.equals( req.user._id)){
                    //move to the next of the code: either delete or edit
                    next();
                    // res.render("campgrounds/edit", {campground: foundCampground});
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/");
                    // res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
                }
            }
            });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("/");
            //console.log("YOU NEED TO BE LOGGED IN TO DO THAT!");
            // res.send("YOU NEED TO BE LOGGED IN TO DO THAT!");
        }
};

middlewareObj.checkCommentOwnerShip = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
             // res.redirect("/campgrounds");
             res.redirect("/");
           }
           else{
              //does user own the comment
              if(foundComment.author.id.equals( req.user._id)){
                 //move to the next of the code: either delete or edit
                 next();
                // res.render("campgrounds/edit", {campground: foundCampground});
              }else{
                 res.redirect("/");
                // res.send("YOU DO NOT HAVE PERMISSION TO DO THAT!");
              }
           }
        });
  }else{
     res.redirect("/");
     //console.log("YOU NEED TO BE LOGGED IN TO DO THAT!");
    // res.send("YOU NEED TO BE LOGGED IN TO DO THAT!");
  }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
     }
     req.flash("error", "You need to be loggedi in to do that");
     //res.redirect("/login"); not worning as it is!!!
     res.render("login",{
        error: req.flash("error")
     });
};

module.exports = middlewareObj;