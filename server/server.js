const express= require('express');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message:"Server Running"
    })
});

app.use('/api', uploadRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});