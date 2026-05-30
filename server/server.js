const express= require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const uploadRoute = require('./routes/uploadRoute');
const cookiesParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookiesParser());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api', uploadRoute);
app.use('/api/auth', require('./routes/authRoute'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});