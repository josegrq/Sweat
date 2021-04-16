//Handle GET for root
var Story = require('../models/story');

module.exports = {
  getHomePage: (request, response) => {
  response.render("home", {Story : Story});
  },
};
