const express = require('express');
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  checkID,
  checkBody
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

// create a checkBody middleware
// check if body contains the name and price property
// If not, send back 400 bad request
// add it to the post handler stack

router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
