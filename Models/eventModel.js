const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  timestamp: { type: Date, required: true },
  sourceAppId: { type: String, required: true },
  dataPayload: { type: mongoose.Schema.Types.Mixed, required: true },
  previousHash: { type: String, required: true }, 
  eventHash: { type: String, required: true },  
});

const Events = mongoose.model('Event', eventSchema);

module.exports = Events;