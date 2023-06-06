require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var https = require('https');
var fs = require('fs');

const indexRouter = require('./../routes/index');
const usersRouter = require('./../routes/users');
const stockRouter = require('./../routes/stock');
const competitionRouter = require('./../routes/competition');
const emailRouter = require('./../routes/email');

// constants
const PORT = 8080;

var app = express();

// view engine setup
app.set('view engine', null);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../build')));
app.use(cors());

app.use('./competition', competitionRouter);
app.use('/api/users', usersRouter);
app.use('/api/stock', stockRouter);
app.use('/api/competitions', competitionRouter);
app.use('/api/email', emailRouter);
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error');
});

// PRODUCTION
// Load the SSL/TLS certificate and key
// const options = {
//   cert: fs.readFileSync('/etc/letsencrypt/live/investingsimulator.info/fullchain.pem'),
//   key: fs.readFileSync('/etc/letsencrypt/live/investingsimulator.info/privkey.pem')
// };

// // Create an HTTPS server with the SSL/TLS certificate and key
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });
/****************************************** */

// DEVELOPMENT
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
