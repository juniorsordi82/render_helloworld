const express = require("express");
const cors = require("cors");
var bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3001;

// #############################################################################
const oneDay = 1000 * 60 * 60 * 23;

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(session({ secret: 'z0a9q8x7a6w5', saveUninitialized: true, resave: false, cookie: { maxAge: oneDay } }));
// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  res.header('Access-Control-Max-Age', 60000);
  //console.log(req.session);
  next();
});
// #############################################################################
app.use('/api/', require('./server/routes/authRoutes'));
app.use('/api/', require('./server/routes/fimsRoutes'));
app.use('/api/v1/', require('./server/routes/empresaRoutes'));
app.use('/api/v1/', require('./server/routes/financeiroRoutes'));

var errorHandler = function (err, req, res, next) {
  console.error(err);
  res.status(422);
  //res.send({ error: err });
  res.json({ message: err.message });
};

app.use(errorHandler);
process.on('uncaughtException', function (error) {
  console.error(error.stack);
});
// #############################################################################
//app.get("/", (req, res) => res.type('html').send(html));

const server = app.listen(port, () => console.log(`Listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
