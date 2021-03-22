const pool = require("../database");
const {
  updateBalance,
  editBalanceUpdatedOperarion,
  editBalanceDeletedOperarion,
} = require("../services/balance.service");

const control = {};

/* ---------------------- SHOW_LAST ---------------------- */
control.showLast = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations ORDER BY date_registered DESC LIMIT 10 "
    );

    res.status(200).json({
      data: {
        operations: operations,
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

/* ---------------------- ADD ---------------------- */
control.add = (req, res) => {
  const { concept, amount, date_registered, type_operation } = req.body;

  const type_operation_id = type_operation === "Egreso" ? 2 : 1;

  const newOperation = {
    concept,
    amount,
    date_registered,
    type_operation_id,
  };

  pool.query(`INSERT INTO operations SET ?`, [newOperation], (err, result) => {
    if (err) {
      console.error(err.code);
      console.error(err.sqlMessage);

      res.status(500).json({
        message: "Internal server error",
        error_code: err.code,
        sql_message: err.sqlMessage,
      });
    } else {
      updateBalance(1, amount, type_operation).then(resMysql =>
        res.status(201).json({
          message: "Operation saved successfully",
          data: newOperation,
        })
      );
    }
  });
};
/* ------------------------------------------------------------ */

/* ---------------------- DELETE ---------------------- */
control.delete = async (req, res) => {
  const { id } = req.params;

  try {
    /* Se recupera el monto previo */
    const operation = await pool.query(
      `SELECT amount, type_operation_id from operations WHERE id='${id}'`
    );
    const amount = operation[0].amount;

    /* Se recupera y convierte el id de la operacion a su descripcion*/
    const type_operation =
      operation[0].type_operation_id === 1 ? "Ingreso" : "Egreso";

    /* Se borra la operacion de la db*/
    const resMysql = await pool.query(`DELETE FROM operations WHERE id=${id}`);

    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      editBalanceDeletedOperarion(1, amount, type_operation);
      res.json({ message: "Operation removed successfully" });
    }
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

/* ---------------------- UPDATE ---------------------- */
control.update = async (req, res) => {
  const { id } = req.params; //operationId
  const { concept, amount, date_registered } = req.body;

  const newOperation = {
    concept,
    amount,
    date_registered,
  };

  try {
    /* Se recupera el monto previo */
    const prevOperation = await pool.query(
      `SELECT amount from operations WHERE id='${id}'`
    );
    const prevAmount = prevOperation[0].amount;

    /* Se actualiza la operacion con los datos nuevos*/
    const resMysql = await pool.query(
      `UPDATE operations SET ? WHERE id='${id}'`,
      [newOperation]
    );
    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      /* Se recupera la operacion con los datos actualizados*/
      const operationUpdated = await pool.query(
        `SELECT * from operations WHERE id='${id}'`
      );
      /* Se recupera y convierte el id de la operacion a su descripcion*/
      const type_operation =
        operationUpdated[0].type_operation_id === 1 ? "Ingreso" : "Egreso";

      /* Se actualiza el balance */
      await editBalanceUpdatedOperarion(1, prevAmount, amount, type_operation);

      /* Se envia una respuesta al cliente */
      res.status(201).json({
        message: "Operation updated successfully",
        data: { id, amount, type_operation },
      });
    }
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

/* ---------------------- SHOW_ENTRIES ---------------------- */
control.showEntries = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations WHERE type_operation_id='1' ORDER BY date_registered DESC"
    );
    res.json({
      data: {
        operations,
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

/* ---------------------- SHOW_OUTPUTS ---------------------- */
control.showOutputs = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations WHERE type_operation_id='2' ORDER BY date_registered DESC"
    );
    res.json({
      data: {
        operations,
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
