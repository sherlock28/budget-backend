const mysql = require("mysql");
const { promisify } = require("util");
const { database } = require("./keys");

/* Se crea un pool de conexiones */
const pool = mysql.createPool(database);

/* Se obtiene la conexion y se verifica que no 
haya habido error*/
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed");
    }
    if (err.code == "ER_CON_COUNT_ERROR") {
      console.error("Database has to many connections");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused");
    }
  }

  if (connection) {
    connection.release();
    console.log("DB is connected");
  }

  return;
});

/* Permite que sea posible usar async/await con las querys sql */
pool.query = promisify(pool.query);

module.exports = pool;
