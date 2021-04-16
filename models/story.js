const mongoose = require("mongoose");
User = require("./user");
//const passportLocalMongoose = require("passport-local-mongoose");


const storySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        img: {
            data: Buffer,
            contentType: String,
        },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

storySchema.methods.getInfo = function () {
    return `Author: ${this.author} Title: ${this.title} Content: ${this.content} Image: ${this.img}`;
};

storySchema.methods.findUserstorys = function () {
    return this.model("Story")
        .find({ author: this.author })
        .exec();
};

storySchema.pre("save", function (next) {
    let story = this;
    if (story.author === undefined) {
        console.log(User.username);
        User.findOne({
          id: story.author
        })
            .then(user => {
                story.author = user;
                next();
            })
            .catch(error => {
                console.log(`Error in connecting user:${error.message}`);
                next(error);
            });
    } else {
        next();
    }
});

module.exports = mongoose.model("Story", storySchema);