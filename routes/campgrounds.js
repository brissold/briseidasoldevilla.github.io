var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX --show all campgrounds
router.get("/", function(req,res){
    console.log(req.user);
     //get all campgrounds from DB
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         }
         else{
             res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user} );
         }
     });
     //res.render("campgrounds", {campgrounds: campgrounds});
 });
 
 //CREATE ROUTe
 router.post("/", middleware.isLoggedIn, function(req,res){
    //  res.send("YOU hit the post route");
      
      //get data from form and add to campgrounds array
      var name  = req.body.name;
      var image = req.body.image;
      var desc = req.body.description;
      var author = {
         id: req.user._id,
         username: req.user.username
      };
      var newCampground = {name: name, image:image, description: desc, author: author};
       console.log(req.user);
 
 //create a new campground and save to DB
   Campground.create(newCampground, function(err, newlycreated){
       if(err){
          console.log(err);
       }
       else{
            //redirect back to campgrounds page
            console.log(newlycreated);
           res.redirect("/campgrounds");
       }
     // campgrounds.push(newCampground);
   });
});

 //NEW -show form to create new campground
 router.get("/new", middleware.isLoggedIn, function(req,res){
       console.log(req.name);
       res.render("campgrounds/new.ejs"); 
 });
 
 /*SHOW - shows more info about one campground*/
 router.get("/:id", function(req,res){
    //find the campgrond with the provided ID
       Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
             if(err){
                console.log(err);
             }
             else{
                console.log(foundCampground);
                  //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});
             }
       });
   // res.send("this will be the show page!");
 });
 /*app.listen(process.env.PORT, process.env.IP, function(){ 
    console.log("Yelpcamp started"); 
 });*/
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req,res){
   //is user logged in
       Campground.findById(req.params.id, function(err, foundCampground){
         res.render("campgrounds/edit", {campground: foundCampground});
      });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req,res){
   //find and update the correct campground
   //var data={name: req.body.name, }
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
         res.redirect("/campgrounds");
      }
      else{
         res.redirect("/campgrounds/" + req.params.id);
      }
   });
   //redirect somewhere(show page)
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req,res){
  // res.send("you are tryign to delete!");
  Campground.findByIdAndRemove(req.params.id, function(err){
     if(err){
       res.redirect("/campgrounds");
     }
     else{
        res.redirect("/campgrounds");
     }
  });
});



  //MIDDLEWARE
  function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }
   res.redirect("/login");
};

function checkCampgroundOwnerShip(req, res, next){
      if(req.isAuthenticated()){
         Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
              // res.redirect("/campgrounds");
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
}
module.exports = router;