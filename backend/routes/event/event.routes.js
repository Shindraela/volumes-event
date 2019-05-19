// Imports

const express = require('express');
const eventRouter = express.Router();

const {
	sendBodyError,
	sendFieldsError,
	sendApiSuccessResponse,
	sendApiErrorResponse
} = require('../../services/server.response');
const { checkFields } = require('../../services/request.checker');

const { createEvent, 
		readEvents, 
		getEvent, 
		updateEvent, 
		changeEventStatus, 
		getEventByUser } = require('./event.controller');

class EventRouterClass {

	constructor({ passport }) {
		this.passport = passport;
	}

	routes() {

		//Return all events
		eventRouter.get('/', (req, res) => {
			readEvents()
				.then((apiResponse) => sendApiSuccessResponse(res, 'Events received', apiResponse))
				.catch((apiResponse) => sendApiErrorResponse(res, 'Error during fetch', apiResponse));
		});

		//Create new event
		//eventRouter.post('/event', this.passport.authenticate('jwt', { session: false }), (req, res) => {
		eventRouter.post('/event', (req, res) => {
			if (typeof req.body === 'undefined' || req.body === null) {
				sendBodyError(res, 'No body data provided');
			}

			const { miss, extra, ok } = checkFields(
				//[ 'date_start', 'date_finish', 'name', 'description', 'category', 'place' ],
				[ 'name', 'description', 'category', 'place' ],
				req.body
			);

			if (!ok) {
				sendFieldsError(res, 'Bad fields provided', miss, extra);
			} else {
				//createEvent(req.body, req.user._id)
				createEvent(req.body, '5c715755efe7bc1a60d3a57f')
					.then((apiResponse) => sendApiSuccessResponse(res, 'Event is created', apiResponse))
					.catch((apiResponse) => sendApiErrorResponse(res, 'Error during event creation', apiResponse));
			}
		});

		//Update event
		eventRouter.put('/event/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
			if (typeof req.body === 'undefined' || req.body === null) {
				sendBodyError(res, 'No body data provided');
			}

			const { miss, extra, ok } = checkFields(
				[ 'status', 'date_start', 'date_finish', 'name', 'description', 'category', 'place' ],
				req.body
			);

			if (!ok) {
				sendFieldsError(res, 'Bad fields provided', miss, extra);
			} else {
				updateEvent(req.body, req.params.id)
					.then((apiResponse) => sendApiSuccessResponse(res, 'Event is updated', apiResponse))
					.catch((apiResponse) => sendApiErrorResponse(res, 'Error during event update', apiResponse));
			}
		});

		//Return all informations of the event by ID
		eventRouter.get('/event/:id', (req, res) => {
			getEvent(req.params.id)
				.then((apiResponse) => sendApiSuccessResponse(res, 'Event received', apiResponse))
				.catch((apiResponse) => sendApiErrorResponse(res, 'Error during fetch', apiResponse));
		});

		//Change status
		eventRouter.put('/change-status/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
			if (typeof req.body === 'undefined' || req.body === null) {
				sendBodyError(res, 'No body data provided');
			}

			const { miss, extra, ok } = checkFields( [ 'status' ], req.body);

			if (!ok) {
				sendFieldsError(res, 'Bad fields provided', miss, extra);
			} else {
				changeEventStatus(req.body, req.params.id)
					.then((apiResponse) => sendApiSuccessResponse(res, 'Event status is updated', apiResponse))
					.catch((apiResponse) => sendApiErrorResponse(res, 'Error during event status update', apiResponse));
			}
		});

		//Get { event name, start date, status } all events by user_ID
		eventRouter.get('/user/:eventId', (req, res) => {
			getEventByUser(req.params.eventId)
				.then((apiResponse) => sendApiSuccessResponse(res, 'All events by user_ID received', apiResponse))
				.catch((apiResponse) => sendApiErrorResponse(res, 'Error during fetch', apiResponse));
		});
	}

	init() {
		this.routes();
		return eventRouter;
	}
}

// Export
module.exports = EventRouterClass;