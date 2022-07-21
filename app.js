const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) global middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour! '
});

app.use('/api', limiter);

app.use(express.json());

//add static file
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello from middleware 🎃');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//read all
// app.get('/api/v1/tours', getAllTours);

//read one
// app.get('/api/v1/tours/:id', getTour);

//Create
// app.post('/api/v1/tours', createTour);

//update
// app.patch('/api/v1/tours/:id', updateTour);

//delete
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'FAIL',
  //   message: `Can not find ${req.originalUrl} on this server! `
  // });

  // const err = new Error(`Can not find ${req.originalUrl} on this server! `);
  // err.status = 'Fail';
  // err.statusCode = 404;

  next(new AppError(`Can not find ${req.originalUrl} on this server! `, 404));
});

// app.use((err, req, res, next) => {
//   console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

app.use(globalErrorHandler);

module.exports = app;
