const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const connectDB = require('./config/connectionDB');




const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
const cors = require('cors');
app.use(cors());

app.use('/recipe', require('./routes/recipe'));

app.use('/user', require('./routes/user'));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
          
});