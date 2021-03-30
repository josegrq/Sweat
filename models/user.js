const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

userSchema.pre("save", (next) => {
  let user = this;
  bcrypt
    .hash(user.password, 10)
    .then((hashedPassword) => {
      user.password = hashedPassword;
      next();
    })
    .catch((error) => {
      console.log(`Error hashing password: ${error.message}`);
      next(error);
    });
});

userSchema.methods.comparePassword = async (password) => {
  let user = this;
  //Will return true if equal
  //return bcrypt.compare(password, user.password);
  console.log("JOSE");
  console.log(user);
  console.log(password);
  console.log(user.password === password);
  return user.password === password;
};
module.exports = mongoose.model("User", userSchema);
