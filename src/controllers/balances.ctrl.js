const pool = require("../database");

/* Se crea un objeto control al cual se le agregaran
las funciones controladoras para las peticiones */
const control = {};

/* Esta funcion es la controladora para las peticiones al endpoint
    [GET].../api/balances/:id y que permite obtener el balance 
    desde la db */
control.getBalance = async (req, res) => {
  try {
    /* Se obtiene el id desde los parametros de 
        la url del endpoint */
    const { id } = req.params; //id del balance
    
    /* Se realiza la query para obtener el balance */
    const balance = await pool.query(`SELECT * from balances WHERE id='${id}'`);
    
    /* Se envia al cliente la respuesta con el balance obtenido */
    res.json({
      data: {
        balance: balance[0],
      },
    });
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);

    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

module.exports = control;
