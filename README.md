# Sweat

Description:
Sweat is a social media web application specially cretaed for the use of athletes in the community. This app follows the same foot steps as other social media applications like Facebook, Twitter, and Instagram.
INSTRUCTIONS:
After you have clone the reposory into a local folder, run the command below to install all the dependencies. You need to be in the folder where the repository was cloned.

    > > npm install

    To seed your local DB with initial data, you need to run the command below before anything.
    >> node seed.js

    Once the above has been done, then run the following command to start the app.
    >> npm start

Jose Ramirez:
As mentioned in Assignment 1, we decided to show a welcome page to the user as they come to our site. This page will allow the user to choose login or sign up for a new acoount.

    I worked on setting up the initial app and structuring the directory. Since we initially created plain HTML files for Assignment 1, I also worked on migrating them to work with Node.js and Express.js.

    I have worked on the following files:
        - welcome.ejs
        - layout.ejs
        - login.ejs
        - seed.js

    We both worked on:
        - controllers
        - home.ejs (This was re-designed to make it more responsive)

    To allow the login page to display useful feedback to the user I took advantage of flash messages which we have implemented throughout the app and to stykle them the alert class from bootstrap was used. This allowed the app to have a clean look. The messages are set to appear ONLY if there is a message for the user and appears at the top of the page.

    The layout.ejs file was re-designed leaving only the main nav bar and header with search bar to allow more space for user content. The user content contaier was also made more responsive with different screen sizes.

    Because we do not want the user to see the nav-bar as they are signing up or in, we do not use the layout.ejs for these three pages. After the user has signed in, then the layout will be used.

    The seed file is plain an simple. Its job is to initialize the Db with a few users for testing.

    The controllers, specially the usersController was implemented to fit the CRUD structure.

    All the design choices made were made to keep it simple for the user to navigate throught the site.


Kyle VanSteelandt:

    I have worked on:
        -signup.ejs
        -controllers
        -seed.js (redid the formating, variable names, and types to match the form)
        -main.js
        -error.ejs

    My biggest issue with the signUp form that I ran into was the fact that I couldn't get the Vue.js script
    that I had created in assignment 2 to carry over and validate the form once it was completed. A lot of the solutions or work arounds I had found online either were not working for me or required something that was never talked about in class. Honestly thought we were supposed to use it because the requirements state that signup.js from assignment 2 needs to be in the public folder. Only thing is ejs has a hard time finding it and using it properly.

    So what the form currently can do:
        -It will use the Browser to check if all the required fields are completed, if not it will bring the user to the first required field and ask that it be completed.
        -All the field that have a invalid character or were blank will turn red
        -If all fields are filled then the new User is added to the database and can login to the site 
        
    Issues I am having:
        -While some of the validation functions work the compare password does not. The validation goes through as long as both password fields are filled.

        Any feedback on how I can do this properly is welcome.
    



    