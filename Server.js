const express = require('express');
const db=require('./db')
const bodyParser = require('body-parser');
const eventRoutes = require('./Routes/eventRoutes');
const dotenv = require('dotenv');

const app=express();
// dot env config
dotenv.config()

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/events', eventRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port `,{PORT});
});