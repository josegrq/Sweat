const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
Story = require("./story");

const userSchema = mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
      },
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      lowercase: true,
      required: false,
      trim: true,
    },
    location: {
      street: {
        type: String,
        lowercase: true,
        required: false,
        trim: true,
      },
      city: {
        type: String,
        lowercase: true,
        required: false,
        trim: true,
      },
      state: {
        type: String,
        lowercase: true,
        required: false,
        trim: true,
      },
      zipCode: {
        type: Number,
        required: true,
        min: [10000, "ZIP code too short"],
        max: 99999,
      },
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      min: "0001-01-01",
      max: Date.now,
    },
    security_questions: {
      question: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
      },
      answer: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
      },
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    Stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
    Connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamp: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

userSchema.methods.addStoryToUser = function (story) {
  return this.model("User")
  .findByIdAndUpdate(
      this._id,
      { $push: { Stories: story._id } },
      { new: true, useFindAndModify: false }
  );
};

module.exports = mongoose.model("User", userSchema);
