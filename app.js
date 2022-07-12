const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//add static file
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from middleware 🎃');
  next();
});

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
module.exports = app;
