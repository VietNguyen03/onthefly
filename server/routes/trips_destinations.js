import express from 'express'
import TripsDestinationsController from '../controllers/trips_destinations.js'
const router = express.Router()

router.post('/', TripsDestinationsController.createTripDestination)
router.get('/trips/:destination_id', TripsDestinationsController.getAllTrips)

export default router