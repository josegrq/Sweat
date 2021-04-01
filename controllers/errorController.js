const httpErrorStatusCodes = require("http-status-codes");

exports.logErrors = (error, req, res, next) => {
  console.error(error.stack);
  next(error);
};

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
  response.send(`${errorCode}, Opps! A little too sweaty something broke...`);
  //response.sendFile(`./public/${errorCode}.html`, {
  //  root: "./",
  //});
  //next();
};
