const express = require('express');
const authRoutes = require('./route/AuthRoute');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3000, "localhost", () => {
  console.log('Server running on port 3000');
});

