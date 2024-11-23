const express = require('express');
const { logEvent, getEvents } = require('../Controllers/eventcontroller');

const router = express.Router();

// Route for log an event
router.post('/', logEvent);

// Route for query events
router.get('/', getEvents);

module.exports = router;