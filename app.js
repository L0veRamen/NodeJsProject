const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// 1) middleware
app.use(morgan('dev'));


app.use(express.json());


app.use((req,res,next)=>{
    console.log('hello from middleware 🎃');
    next()
})

app.use((req,res,next)=>{
   req.requestTime = new Date().toISOString();
   next();
})


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) route handler

const getAllTours = (req, res) => {
  console.log(req.requestTime);   
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updating tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

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
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

 // 4) start server 
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
