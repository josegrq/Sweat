# Sweat

Description:
Sweat is a social media web application specially created for the use of athletes
in the community. This app follows the same foot steps as other social media
applications like Facebook, Twitter, and Instagram

INSTRUCTIONS:
This web application has been published/deployed using heroku and MongoDB Atlas
Database. The site can be accessed at: https://blooming-cove-18869.herokuapp.com/

Jose Ramirez:
We decided to show a welcome page to the user as they come to our site.
This page will allow the user to choose login or sign up for a new acoount.

    I worked on the following: (UPDATED 05-13-2021)
     - Updated User model to make them more robust
     - Added CRUD actions for users and restructure web app to follow the structure discussed in Week 10.
     - Added sessions and cookies
     - Used passport for handling user sign-up and sign-in ass well as password change
     - Used express-validator to reimplement validations and used sessions to show error messages to users
     - Extended views to show if user has logged in, and also handled user logouts
     - Added proper error handling.
     - Proper access control
     - (Extra Feature) Messages
     - Follow/Unfollow
     - Notifications

    To allow the login page to display useful feedback to the user I took advantage
    of flash messages which we have implemented throughout the app and to style them
    the alert class from bootstrap was used. This allowed the app to have a clean
    look. The messages are set to appear ONLY if there is a message for the user and
    appears at the top of the page.

    The layout.ejs file was re-designed leaving only the main nav bar and header with
    search bar to allow more space for user content. The user content contaier was
    also made more responsive with different screen sizes.

    Because we do not want the user to see the nav-bar as they are signing up or in,
    we do not use the layout.ejs for these three pages. After the user has signed in,
    then the layout will be used.

    The controllers were implemented to fit the CRUD
    structure.

    All the design choices made were made to keep it simple for the user to navigate
    throught the site.

Kyle VanSteelandt:

    I have worked on: (UPDATED 5/13/2021)
        -signup.ejs
        -controllers
        -seed.js (redid the formating, variable names, and types to match the form)
        -main.js (added all the story routes)
        -error.ejs
        -stories
        -show.ejs(in stories)
        -showFeed.ejs
        -story.ejs
        -storyController.js (added tag functionality)
        -story.js (model)
        -layout.css
        -home.ejs
        -tags (model, view, and controllers)
        -trending.ejs

    About Stories:

    Orignally it was called posts but that got really confusing so it was changed to
    Sweaty Stories! Stories is its own model and contains the following:
         Title
         Author
         Content
         Image
         Tags
    Also to go along with the User model as every post needs an author a 'Stories'
    Array was added which is to be populated by the users stories as they create
    them. To handle the image upload we are using Multer which will upload the
    images to a directory called ./public/uploads this file will contain the binary
    of the uploaded .PNG images.

    When the User first enters the website they are greeted with a Welcome (first
    name last name) and presented with a story creation form. Under that we have the
    User profile.

    When the User selects the 'All Link' they will be presented with all the
    stories in the database.

    If the User clicks the 'Post' link they are brought to a page that contains the
    layout and only the Story Creation form.

    If a User clicks the author's ID on a post they are redirected to the authors
    profile page. If the User clicks the title of the story they are brought to a
    page where the story is the only thing presented. At this page if the User ID
    is the same as the author ID they will be able to see a 'Edit' button and
    'Delete" button. 

    About Tags:
        _id
        name
        Stories
    A user can tag a post by adding a '#' before any number of words and each word will then be 
    added to the database as a tag. If the tag already exists the story that was just
    created by the user will be added to the tags 'Stories' reference array. The story 
    will also get the tag._id from the new or existing tag and add that to its own reference.

    An error that I was runing into while working on this part was that the reference arrays were
    not adding the 'id'. With Professor Haadi Jafarian's help I was to find that I was missing a '.then()' clause that was needed to resolve the promise.
    *****This took so long to get working right I had little time left to fix the bugs and 
    create the trending page******

    The trending page currently pulls the tags out of the database and display's them. I have a aggragate function to sort them by the size of the 'Stories' array. This is all that is currently
    working.

    Fixes from last submission:
    Profile can be updated without the stories error.
    Stories now get placed into the user.

    Current issues:
    Tags are permanant with no way to delete them from the website currently.
    Stories when edited do not update the tags.
    Tending is not displaying all the desired information about each tag its only ranking them.
    

