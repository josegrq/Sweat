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
        location: "",
        email: "jose.ramirez@gmail.com",
        password: "SecretPassword1234",
        dob: "1997-10-19",
        security_questions: [
          {
            question: "What is your favorite color?",
            answer: "Green",
          },
          {
            question: "What is your favorite hobby?",
            answer: "Hiking",
          },
          {
            question: "What is your favorite movie genre?",
            answer: "Comedy",
          },
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Gabriel",
          last_name: "Quezada",
        },
        username: "GQ",
        gender: "male",
        location: "",
        email: "g.quezada@email.com",
        password: "SecretPassword1234",
        dob: "2003-06-02",
        security_questions: [
          {
            question: "What is your favorite color?",
            answer: "Red",
          },
          {
            question: "What is your favorite hobby?",
            answer: "Painting",
          },
          {
            question: "What is your favorite movie genre?",
            answer: "Horror",
          },
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Alex",
          last_name: "Ramirez",
        },
        username: "AlexR",
        gender: "male",
        location: "",
        email: "AlexR@gmail.com",
        password: "SecretPassword1234",
        dob: "1995-11-23",
        security_questions: [
          {
            question: "What is your favorite color?",
            answer: "Red",
          },
          {
            question: "What is your favorite hobby?",
            answer: "Gaming",
          },
          {
            question: "What is your favorite movie genre?",
            answer: "Horror",
          },
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Brenda",
          last_name: "Hernandez",
        },
        username: "BHern",
        gender: "female",
        location: "",
        email: "brenda@email.com",
        password: "SecretPassword1234",
        dob: "1990-08-29",
        security_questions: [
          {
            question: "What is your favorite color?",
            answer: "White",
          },
          {
            question: "What is your favorite hobby?",
            answer: "Watching Movies",
          },
          {
            question: "What is your favorite movie genre?",
            answer: "Comedy",
          },
        ],
        bio: "",
      },
      {
        name: {
          first_name: "Maria",
          last_name: "Rodriguez",
        },
        username: "MRodri",
        gender: "female",
        location: "",
        email: "marodriguez@gmail.com",
        password: "SecretPassword1234",
        dob: "1996-07-26",
        security_questions: [
          {
            question: "What is your favorite color?",
            answer: "Pink",
          },
          {
            question: "What is your favorite hobby?",
            answer: "Biking",
          },
          {
            question: "What is your favorite movie genre?",
            answer: "Drama",
          },
        ],
        bio: "",
      },
    ],
  },
];
