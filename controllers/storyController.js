const { request } = require("express");
var Story = require("../models/story");
var Tag = require("../models/tag");
var fs = require("fs");
var path = require("path");
const User = require("../models/user");
const mongoose = require("mongoose");

const getParams = (body) => {
  return {
    title: body.title,
    content: body.content,
    img: {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
    author: req.user,
  };
};

module.exports = {
  index: function (req, res, next) {
    Story.find({})
      .then((story) => {
        res.locals.story = story;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching story: ${error.message}`);
        next(error);
      });
  },
  indexView: function (req, res) {
    res.render("stories/showFeed");
  },
  saveStory: (req, res) => {
    let newStory = new Story({
      title: req.body.title,
      content: req.body.content,
      img: {
        data: fs.readFileSync(path.join(__dirname, '../public/uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      author: req.user,
      tags: extractTag(req.body.content),
    });

    newStory
      .save()
      .then((result) => {
        console.log("newStory", newStory);
        User.findByIdAndUpdate(
          { author: { author: userId } },
          { $addToSet: { Stories: mongoose.Types.ObjectId(newStory._id) } },
          { safe: true, upsert: true },
          function (err, doc) {
            if (err) {
              console.log(err);
            }
          }
        ).then(res => console.log("updated user:", res));

        newStory.tags.forEach(
          Tag.findOneAndUpdate(
            { tags: { name: tag.name } },
            { $addToSet: { Stories: mongoose.Types.ObjectId(newStory._id) } },
            { safe: true, upsert: true },
            function (err, doc) {
              if (err) {
                console.log(err);
              }
            }
          ).then(res => console.log("updated tag:", res))
        );
        res.render("home");
      })
      .catch((error) => {
        if (error) res.send(error);
      });
  },
  new: (req, res) => {
    res.render("stories/story");
  },
  show: (req, res, next) => {
    console.log("req:  ", req);
    let storyId = req.params.id;
    Story.findById(storyId)
      .then((story) => {
        res.locals.story = story;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching story by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("stories/show");
  },
  validate: (request, response, next) => {
    request
      .check("title", "Invalid title (check invalid characters)")
      .notEmpty()
      .matches(/^[a-zA-Z0-9\s,'-]*$/);
    request
      .check(
        "content",
        "Invalid content (check invalid characters in content field)"
      )
      .notEmpty()
      .matches(/^[a-zA-Z0-9\s,'-]*$/);
    request.getValidationResult().then((error) => {
      //ERRORS
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = `/stories/${currentUser._id}`;
        next();
      } else {
        next();
      }
    });
  },
  validateUpdate: (request, response, next) => {
    const storyID = request.params.id;
    request
      .check("title", "Invalid title (check invalid characters)")
      .notEmpty()
    request
      .check(
        "content",
        "Invalid content (check invalid characters in content field)"
      )
      .notEmpty()
    request.getValidationResult().then((error) => {
      //ERRORS
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = `/stories/${storyID}/edit`;
        next();
      } else {
        next();
      }
    });
  },
  create: (req, res, next) => {
    if (req.skip) {
      return next();
    }
    //console.log(req);
    //console.log("req.user", req.user);
    //console.log("req.user.username", req.user.username);
    //console.log("req.body", req.body);
    //console.log(req.file);
    //console.log("req.body", req.body);
    let newStory = {
      title: req.body.title,
      content: req.body.content,
      /*img: {
        data: fs.readFileSync(path.join(__dirname, '../public/uploads/' + req.file.filename)),
        contentType: 'image/png'
      },*/
      author: req.user,
    };
    Story.create(newStory)
      .then((story) => {
        //console.log("story:  ", story.id);
        console.log("story:  ", story);
        res.locals.redirect = `/stories/${story._id}/show`;
        res.locals.story = story;
        storyID = story._id;
        //console.log("res locals", res.locals)
        User.findByIdAndUpdate(req.user._id,
          { $push: { Stories: storyID } },
          { safe: true, upsert: true },)
          .then((res)=>{
            console.log("updated user:", res);
          }).catch((error) => {
            next(error);
          });
        //We need to notify all users that follow this user
        User.find({ Connections: req.user._id })
          .then((users) => {
            //users that follow this user
            for (var i = 0; i < users.length; i++) {
              //push a notification
              User.findByIdAndUpdate(users[i]._id, {
                $addToSet: {
                  Notifications: story._id,
                },
              })
                .then(() => {
                  console.log("SUCCESSSSSSSSSSS");
                })
                .catch((error) => {
                  next(error);
                });
            }
            next();
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((error) => {
        console.log(`Error saving story: ${error.message}`);
        next(error);
      });
  },
  edit: (req, res, next) => {
    let storyID = req.params.id;
    Story.findById(storyID)
      .then((story) => {
        res.render("stories/edit", { story: story });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  update: (req, res, next) => {
    if (req.skip) {
      return next();
    }
    let storyID = req.params.id;
    let storyParams = getParams(req.body);
    Story.findByIdAndUpdate(storyID, storyParams)
      .then((story) => {
        res.locals.redirect = `/stories/${storyID}/show`;
        request.flash("success", "Your story has been successfully updated!");
        res.locals.story = story;
        next();
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  delete: (request, response, next) => {
    let storyID = request.params.id;
    Story.findByIdAndDelete(storyID)
      .then((story) => {
        //You can do something with the deleted story info if you want
        request.flash("success", "Your Story has been DELETED.");
        response.locals.redirect = "home";
        next();
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },
  extractTags: (req, res, next) => {
    /*
      str is the content of the story
      arr is the array that stores the tags found in the story
      rx is the pattern used to get the word after the #

      Tags are taken out of the content box and put into an
      array. This array then searches each tag to see if it
      exists in the tag collection. 
      
      If the tag does not exist it creates a new tag and 
      adds the new story to its list of stories. 
      **** This part works ****

      If there is a duplicate of the tag, it finds the original and
      adds the new story to the Stories array in the tag collection,
      also it adds the tags orignal id to the story tags.
      ****This part does not work****
    */
    let str = req.body.content;
    let arr = [];
    var index = 0;
    var rx = /(?<=#)(.\w*)/gm;
    str.replace(rx, function (m) {
      arr.push({ name: m });
    });
    arr.forEach(function () {
      console.log("extractTag array:", arr[index].name);
      Tag.findOne({ name: arr[index].name }, function (err, doc) {
        //console.log("TAG ", doc);
        res.locals.tag = doc;
        //console.log("After find",res.locals.tag);
        if (res.locals.tag == null) {
          let newTag = {
            name: arr[index].name,
            Stories: res.locals.story._id,
          };
          Tag.create(newTag)
            .then((tag) => {
              //console.log("new tag id:", tag._id);
              //console.log("tag name:", tag.name);
              res.locals.tag = tag;
              //console.log("res", res.locals);
              Story.findByIdAndUpdate(
                res.locals.story._id,
                { $addToSet: { tags: mongoose.Types.ObjectId(res.locals.tag._id) } },
                { new: true, useFindAndModify: false, upsert: true }
              ).then(res => console.log("updated story:", res));
              
              Tag.findByIdAndUpdate(
                res.locals.tag._id,
                { $addToSet: { Stories: mongoose.Types.ObjectId(res.locals.story._id) } },
                { new: true, useFindAndModify: false, upsert: true }
              );
              next();
            }).then(res => console.log("updated tag:", res))
            .catch((error) => {
              console.log(`Error saving tag: ${error.message}`);
              next(error);
            });
        } else {
          //console.log("res story", res.locals.story);
          //console.log("res tag", res.locals.tag);
          Tag
            .findByIdAndUpdate(
              res.locals.tag._id,
              { $addToSet: { Stories: mongoose.Types.ObjectId(res.locals.story._id) } },
              { new: true, upsert: true }
            ).then(res => console.log("updated tag:", res));
          //res.locals.tag.addStoryToTag(res.locals.story);
          //console.log("We still working here A");
          Story
            .findByIdAndUpdate(
              res.locals.story._id,
              { $addToSet: { tags: mongoose.Types.ObjectId(res.locals.tag._id) } },
              { new: true, upsert: true }
            ).then(res => console.log("updated story:", res));
          //res.locals.story.addTagToStory(res.locals.tag);  

          //console.log("res story", res.locals.story);
          //console.log("res tag", res.locals.tag);
          //console.log("We still working here B");
          //console.log("res", res.locals);
          //console.log("req", req);
          //console.log("res after tag:", res.locals);*/
        }
        index++;
      });
    });
    next();
  },
};
