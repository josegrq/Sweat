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
        madeSweaty: [req.body.madeSweaty],
        authorId: req.body.authorId,
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
            madeSweaty: [req.body.madeSweaty],
            authorId: req.body.authorId,
            author: req.body.author,
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


    //new: function (req, res, next) {
    //    let authorId = req.params.id; 
    //    console.log(authorId);
    //    console.log(req.params);
    //    Story.findById(authorId)
    //        .then((story) => {
    //            res.render(`users/story`, {authorId: authorId});
    //        })
    //        .catch((error) => {
    //            console.log(error);
    //            next(error);
    //        });
    //},
    show: (req, res, next) => {
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
        res.render("stories/:id/show");
    },
    create: (req, res, next) => {
        if (req.skip) {
            return next();
        }
        console.log(req.body);
        console.log(req.file);
        let newStory = {
            authorId: req.body.authorId,
            title: req.body.title,
            content: req.body.content,
            img: {
                data: fs.readFileSync(path.join(__dirname, '../public/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            madeSweaty: [req.body.madeSweaty],
            author: req.body.author
        };
        Story.create(newStory)
            .then(story => {
                console.log(story.author);
                console.log(newStory.content);
                res.locals.redirect = "/stories/show/";
                res.locals.story = story;
                next();
            })
            .catch(error => {
                console.log(`Error saving story: ${error.message}`);
                next(error);
            });
    },
    redirectView: (request, response, next) => {
        let newPath = response.locals.redirect;
        if (newPath) {
            response.redirect(newPath);
        }
    },

};