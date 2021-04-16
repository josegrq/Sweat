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

    I worked on the following: (UPDATED 04-13-2021)
     - Updated User model to make them more robust
     - Added CRUD actions for users and restructure web app to follow the structure discussed in Week 10.
     - Added sessions and cookies
     - Used passport for handling user sign-up and sign-in ass well as password change
     - Used express-validator to reimplement validations and used sessions to show error messages to users
     - Extended views to show if user has logged in, and also handled user logouts
     - Added proper error handling.

    To allow the login page to display useful feedback to the user I took advantage of flash messages which we have implemented throughout the app and to style them the alert class from bootstrap was used. This allowed the app to have a clean look. The messages are set to appear ONLY if there is a message for the user and appears at the top of the page.

    The layout.ejs file was re-designed leaving only the main nav bar and header with search bar to allow more space for user content. The user content contaier was also made more responsive with different screen sizes.

    Because we do not want the user to see the nav-bar as they are signing up or in, we do not use the layout.ejs for these three pages. After the user has signed in, then the layout will be used.

    The seed file is plain an simple. Its job is to initialize the Db with a few users for testing.

    The controllers, specially the usersController was implemented to fit the CRUD structure.

    All the design choices made were made to keep it simple for the user to navigate throught the site.

Kyle VanSteelandt:

    I have worked on: (UPDATED 4/15/2021)
        -signup.ejs
        -controllers
        -seed.js (redid the formating, variable names, and types to match the form)
        -main.js (added all the story routes)
        -error.ejs
        -stories
        -show.ejs(in stories)
        -showFeed.ejs
        -story.ejs
        -storyController.js
        -story.js (model)
        -layout.css
        -home.ejs

    About Stories:
    
    Orignally it was called posts but that got really confusing so it was changed to
    Sweaty Stories! Stories is its own model and contains the following:
         Title
         Author
         Content
         Image
         Followers (placeholder)
    Also to go along with the User model as every post needs an author a 'Stories'
    Array was added which is to be populated by the users stories as they create 
    them. To handle the image upload we are using Multer which will upload the
    images to a directory called ./public/uploads this file will contain the binary 
    of the uploaded .PNG images. 

    When the User first enters the website they are greeted with a Welcome (first 
    name last name) and presented with a story creation form. Under that we have the
    User profile. 

    When the User selects the 'Trending Link' they will be presented with all the
    stories in the database.

    If the User clicks the 'Post' link they are brought to a page that contains the
    layout and only the Story Creation form.

    If a User clicks the author's ID on a post they are redirected to the authors
    profile page. If the User clicks the title of the story they are brought to a 
    page where the story is the only thing presented. At this page if the User ID 
    is the same as the author ID they will be able to see a 'Edit' button and 
    'Delete" button. There is also a 'Follow' button that has not been implimented
    yet.

    Current issues, Things that need more work:
    Stories currently do not get added to the User Stories array. I believe this is
    just an issue with how I am trying to do it but I can't see to get it working
    properly without it crashing.
    Needs more testing with multiple users posts but since I was having trouble 
    getting them to push into the Stories array I haven't been able to really look
    at this.
    For whatever reason the Stories Schema does not like that the User.name is a
    thing, it doesn't allow me to look up the username which probably has the same
    sort of solution as the empty array.