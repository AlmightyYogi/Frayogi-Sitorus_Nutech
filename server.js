const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api', bannerRoutes);
app.use('/api', serviceRoutes);

app.use('/api', transactionRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
