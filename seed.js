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
          first_name: "Jose",
          last_name: "Ramirez",
        },
        username: "JOSEGRQ",
        gender: "male",
        location: {
          address: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: "12345"

        },
        email: "jose.ramirez@gmail.com",
        password: "SecretPassword1234",
        dob: "1997-10-19",
        security_questions: [
          {
            question: "What was your first place of employment?",
            answer: "Store",
          }
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Bill",
          last_name: "Doetrive",
        },
        username: "BillyBoy",
        gender: "male",
        location: {
          address: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: "12345"

        },
        email: "billy@gmail.com",
        password: "SecretPassword34",
        dob: "1990-15-20",
        security_questions: [
          {
            question: "What was your first place of employment?",
            answer: "Store",
          }
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Hank",
          last_name: "Hill",
        },
        username: "mrHill",
        gender: "male",
        location: {
          address: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: "12345"

        },
        email: "hankhill@gmail.com",
        password: "SecretPass12",
        dob: "1960-10-19",
        security_questions: [
          {
            question: "What was your first place of employment?",
            answer: "Store",
          }
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Boomhauer",
          last_name: "Boomer",
        },
        username: "Boomer",
        gender: "male",
        location: {
          address: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: "12345"

        },
        email: "mumbler@gmail.com",
        password: "Secret234",
        dob: "1997-10-19",
        security_questions: [
          {
            question: "What was your first place of employment?",
            answer: "Store",
          }
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Dale",
          last_name: "Grible",
        },
        username: "Exterminator",
        gender: "male",
        location: {
          address: "12345 st",
          city: "Denver",
          state: "Colorado",
          zipCode: "12345"

        },
        email: "guns4life@gmail.com",
        password: "Ikillthings123",
        dob: "1950-10-19",
        security_questions: [
          {
            question: "What was your first place of employment?",
            answer: "Store",
          }
        ],
        bio: "",
      },
    ],
  },
];
