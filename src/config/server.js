const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

/* Se inicia la configuracion para usar 
    las variables de entorno */
dotenv.config();

module.exports = app => {
  /* --------------- SETTINGS --------------- */
  /* Se configura el puerto donde escuchara el servidor */
  app.set("port", process.env.PORT || 4000);
  
  /* --------------- MIDDLEWARES --------------- */
  /* Se configura los middlewares */
  app.use(express.json());
  app.use(cors());
  
  if(process.env.NODE_ENV === 'development') {
    const morgan = require("morgan");
    app.use(morgan("dev"));
  }

  /* --------------- ROUTES --------------- */
  /* Se configura las rutas o endpoints */
  app.use("/api/operations", require("../routes/operations.routes"));
  app.use("/api/balances", require("../routes/balances.routes"));
  app.use("/api/users", require("../routes/users.routes"));

  /* Se retorna la app express ya configurada */
  return app;
};
