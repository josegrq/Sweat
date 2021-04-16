const { request } = require("express");
var Story = require('../models/story');
var fs = require('fs');
var path = require('path');

const getParams = (body) => {
    return {
        title: req.body.title,
        content: req.body.content,
        img: {
            data: fs.readFileSync(path.join(__dirname, '../public/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        followers: [req.body.followers],
        author: req.body.author,
    }
};
module.exports = {
    index: function (req, res, next) {
        Story.find({})
            .then(story => {
                res.locals.story = story;
                next();
            })
            .catch(error => {
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
            followers: [],
            author: req.user,
        });
        newStory
            .save()
            .then(result => {
                res.render("home");
            })
            .catch(error => {
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
            .then(story => {
                res.locals.story = story;
                next();
            })
            .catch(error => {
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
        .check("content", "Invalid content (check invalid characters in content field)")
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s,'-]*$/);
        request.getValidationResult().then((error) => {
            //ERRORS
            if (!error.isEmpty()) {
              let messages = error.array().map((e) => e.msg);
              request.flash("error", messages.join(" and "));
              request.skip = true;
              response.locals.redirect = `/stories/${currentUser.id}/story`;
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
        //console.log("req.user", req.user._id);
        //console.log("req.user.username", req.user.username);
        //console.log("req.body.title", req.body.title);
        //console.log(req.file);
        //console.log("req.body", req.body); 
        let newStory = {
            title: req.body.title,
            content: req.body.content,
            img: {
                data: fs.readFileSync(path.join(__dirname, '../public/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            followers: [],
            author: req.user
        };
        Story.create(newStory)
            .then(story => {
                console.log("req.user.Stories: ", req.user.Stories);
                //console.log("story:  ", story.id);  
                //console.log("story:  ", story);
                res.locals.redirect = "/stories";
                res.locals.story = story;
                 console.log("story", story)
                next();
            })
            .catch(error => {
                console.log(`Error saving story: ${error.message}`);
                next(error);
            });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
      }

};