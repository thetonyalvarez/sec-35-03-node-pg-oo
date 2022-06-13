/** Express app for Lunchly. */

const express = require("express");
const ExpressError = require("./expressError");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

app.use(routes);

/** 404 handler */

app.use(function(req, res, next) {
  const notFoundError = new ExpressError("404 Not Found.", 404);
  err.status = 404;

  // pass the error to the next piece of middleware
  return next(notFoundError);
});

/** general error handler */

app.use((err, req, res, next) => {
	// default 500
	let status = err.status || 500;
	let message = err.message;

	return res.status(status).json({ error: { message, status } });
});

module.exports = app;
