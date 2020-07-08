var express= require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//* COMMENTS NEW ROUTE */
router.get("/new",  middleware.isLoggedIn, function(req,res){
    //find campground by id
    console.log(req.params.id);

    Campground.findById(req.params.id, function(err,campground){
       if(err){
          console.log(err);
       }
       else{
          res.render("comments/new", {campground: campground});
       }
    });
    //res.send("THIS WILL BE THE COMMETN FORM");
   // res.render("comments/new");
 });
 
 //COMMENTS CREATE
 router.post("/",   middleware.isLoggedIn, function(req,res){
       //lookup campground using ID
       Campground.findById(req.params.id, function(err,campground){
          if(err){
             console.log(err);
             res.redirect("/campgrounds");
          }
          else{
             Comment.create(req.body.comment,function(err,comment){
                if(err){
                   console.log(err);
                }
                else{
                   //ADD USER name and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                //  console.log("New comment's username will be: " + req.user.username);
                  //add user name/id to comments
                  //console.log(req.user);
                  //save comment
                  comment.save();
                   //assocaite the commetn to campground
                   campground.comments.push(comment);
                   //save comment
                   campground.save();
                   console.log(comment);
                   req.flash("success", "Successfully added comment");
                   //campogroudns/id
                   res.redirect('/campgrounds/' + campground._id);
                }
             });
             //console.log(req.body.comment);
          }
       }); 
 });
//COMMENT EDIT ROUTE
 router.get("/:comment_id/edit",  middleware.checkCommentOwnerShip, function(req,res){
   //res.send("EDIT ROUTE FOR COMMENT!");
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
         res.redirect("/");
      }else{
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
  // res.render("comments/edit", {campground_id: req.params.id});
});
//COMMENT UPDATE ROUTE
//campgrounds/:id/comments/:comment_id
router.put("/:comment_id", function(req,res){
  // res.send("UPDATE ROUTE FOR COMMENTS");
      Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err){
            res.redirect("/");
         }
         else{
            res.redirect("/campgrounds/" + req.params.id );
         }
      });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",  middleware.checkCommentOwnerShip, function(req,res){
//findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
         if(err){
            res.redirect("/");
         }else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+ req.params.id);
         }
   });
 //  res.send("THIS IS THE DESTROY COMMENT ROUTE");
});
 //MIDDLEWARE
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/login");
 };

 function checkCommentOwnerShip(req, res, next){
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
}

 module.exports = router;