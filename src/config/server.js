const express = require('express');
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require("morgan");

dotenv.config();

module.exports = app => {
    
  // settings
  app.set("port", process.env.PORT || 4000);

  // middlewares
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // routes
  app.use('/api/operations', require("../routes/operations.routes"));

  return app;
};
