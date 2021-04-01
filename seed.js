var seeder = require("mongoose-seed");

const database = "mongodb://localhost:27017/Sweat";
seeder.connect(database, () => {
  //We load models HERE
  seeder.loadModels(["./models/user.js"]);

  //We clear the collections/tables
  seeder.clearModels(["User"], () => {
    seeder.populateModels(data, (error, success) => {
      if (error) return console.log("Error seeding DB: ", error);
      if (success) return console.log("Seeding was successful: ", success);

      seeder.disconnect();
    });
  });
});

var data = [
  {
    model: "User",
    documents: [
      {
        name: {
          firstName: "Jose",
          lastName: "Ramirez",
        },
        username: "JOSEGRQ",
        gender: "male",
        location: {
          street: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: 12345

        },
        email: "jose.ramirez@gmail.com",
        password: "SecretPassword1234",
        dob: "1997-10-19",
        security_questions: 
        {
          question: "What was your first place of employment?",
          answer: "Store",
        },
        bio: "",
      },
      {
        name: {
          firstName: "Bill",
          lastName: "Doetrive",
        },
        username: "BillyBoy",
        gender: "male",
        location: {
          street: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: 12345

        },
        email: "billy@gmail.com",
        password: "SecretPassword1234",
        dob: "1990-10-10",
        security_questions: 
        {
          question: "What was your first place of employment?",
          answer: "Store",
        },
        bio: "",
      },
      {
        name: {
          firstName: "Hank",
          lastName: "Hill",
        },
        username: "mrHill",
        gender: "male",
        location: {
          street: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: 12345

        },
        email: "hankhill@gmail.com",
        password: "SecretPassword1234",
        dob: "1960-10-19",
        security_questions: 
        {
          question: "What was your first place of employment?",
          answer: "Store",
        },
        bio: "",
      },
      {
        name: {
          firstName: "Boomhauer",
          lastName: "Boomer",
        },
        username: "Boomer",
        gender: "male",
        location: {
          street: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: 12345

        },
        email: "mumbler@gmail.com",
        password: "SecretPassword1234",
        dob: "1997-10-19",
        security_questions: 
        {
          question: "What was your first place of employment?",
          answer: "Store",
        },
        bio: "",
      },
      {
        name: {
          firstName: "Dale",
          lastName: "Grible",
        },
        username: "Exterminator",
        gender: "male",
        location: {
          street: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: 12345

        },
        email: "guns4life@gmail.com",
        password: "SecretPassword1234",
        dob: "1950-10-19",
        security_questions: 
        {
          question: "What was your first place of employment?",
          answer: "Store",
        },
        bio: "",
      },
    ],
  },
];
