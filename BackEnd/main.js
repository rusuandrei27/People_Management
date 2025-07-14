const express = require('express');
const authRoutes = require('./route/AuthRoute');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
