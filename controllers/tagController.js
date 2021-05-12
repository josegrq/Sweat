const { request } = require("express");
var Story = require('../models/tag');
var Tag = require('../models/tag');

const getParams = (body) => {
    return {
        name: req.body.name,
        Stories: req.body.Stories,
    }
};
module.exports = {
    index: function (req, res, next) {
        Tag.find({})
            .then(tag => {
                res.locals.tag = tag;
                next();
            })
            .catch(error => {
                console.log(`Error fetching tag: ${error.message}`);
                next(error);
            });
    },
    indexView: function (req, res) {
        res.render("tags/trending");
    },
    show: (req, res, next) => {
        console.log("req:  ", req);
        let tagId = req.params.id;
        Tag.findById(tagId)
            .then(tag => {
                res.locals.tag = tag;
                next();
            })
            .catch(error => {
                console.log(`Error fetching tag by ID: ${error.message}`);
                next(error);
            });
    },
}