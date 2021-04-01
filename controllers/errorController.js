const httpErrorStatusCodes = require("http-status-codes");

exports.pageNotFoundError = (request, response) => {
  let errorCode = httpErrorStatusCodes.NOT_FOUND;
  response.status(errorCode);
  //response.send(`${errorCode}, Opps! No sweat there...`);
  response.render("error");
  //response.sendFile(`./public/${errorCode}.html`, {
  //  root: "./",
  //});
};

exports.internalServerError = (error, request, response, next) => {
  let errorCode = httpErrorStatusCodes.INTERNAL_SERVER_ERROR;
  response.status(errorCode);
  response.send(`${errorCode}, Opps! A little too sweaty...`);
  //response.sendFile(`./public/${errorCode}.html`, {
  //  root: "./",
  //});
  //next();
};
