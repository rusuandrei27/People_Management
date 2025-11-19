require("./utils/logger");
const express = require('express');
const authRoutes = require('./route/AuthRoute');
const getItemsRoutes = require('./route/GetItemsRoute');
const revenuesRoutes = require('./route/RevenueRoute');
const userConfigurationRoutes = require('./route/UserConfigurationRoute')

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/getItems', getItemsRoutes);
app.use('/revenue', revenuesRoutes);
app.use('/userConfiguration', userConfigurationRoutes);

const port = process.env.PORT || 3000;

app.listen(port, "localhost", () => {
  log("main.js", "Server started listening on port: " + port);
  console.log('Server running on port ' + port);
});
