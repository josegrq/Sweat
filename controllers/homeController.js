//Handle GET for root
module.exports = {
  getHomePage: (request, response) => {
    response.render("home");
  },
};
