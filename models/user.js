const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    first_name: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
  },
  username: {
    type: String,
    lowercase: true,
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
    type: String,
    lowercase: true,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    min: "0001-01-01",
    max: Date.now,
  },
  security_questions: [
    {
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
  ],
  bio: {
    type: String,
    required: false,
    trim: true,
  },
});

module.exports = mongoose.model("User", userSchema);
