const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        Stories: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: "Story"
            }
        ]
    }
);

tagSchema.methods.getInfo = function () {
    return `name: ${this.name} Stories: ${this.Stories} ID: ${this._id}`;
};

tagSchema.methods.addStoryToTag = function (story) {
    return this.model("Tag")
    .findByIdAndUpdate(
        this._id,
        { $addToSet: { Stories: story._id } },
        //{ new: true, useFindAndModify: false }
    );
};

module.exports = mongoose.model("Tag", tagSchema);