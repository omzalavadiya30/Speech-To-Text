const express= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadRoute = require('./routes/uploadRoute');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api', uploadRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});