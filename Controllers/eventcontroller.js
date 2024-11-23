const crypto = require('crypto');
const Event = require('../Models/eventModel');

// Helper function to generate a SHA-256 hash
const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Function for  log an event
const logEvent = async (req, res) => {
  const { eventType, timestamp, sourceAppId, dataPayload, previousHash } = req.body;

  // Validate incoming event data
  if (!eventType || !timestamp || !sourceAppId || !dataPayload || !previousHash) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate current event's hash
    const eventData = `${eventType}${timestamp}${sourceAppId}${JSON.stringify(dataPayload)}${previousHash}`;
    const eventHash = generateHash(eventData);

    // Create a new event document
    const newEvent = new Event({
      eventType,
      timestamp,
      sourceAppId,
      dataPayload,
      previousHash,
      eventHash,
    });

    // Save event to MongoDB
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error logging event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function for query events
const getEvents = async (req, res) => {
  const { eventType, sourceAppId, startTimestamp, endTimestamp, page = 1, limit = 10 } = req.query;

  try {
    const filters = {};
    if (eventType) filters.eventType = eventType;
    if (sourceAppId) filters.sourceAppId = sourceAppId;
    if (startTimestamp && endTimestamp) {
      filters.timestamp = { $gte: new Date(startTimestamp), $lte: new Date(endTimestamp) };
    }

    const events = await Event.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ timestamp: 1 });

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { logEvent, getEvents };