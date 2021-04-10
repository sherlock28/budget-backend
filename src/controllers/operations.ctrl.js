/* Se importa la conexion a la db y las funciones que 
permitiran actulizar el balance en cada caso */
const pool = require("../database");
const {
  editBalanceCreatedOperation,
  editBalanceUpdatedOperation,
  editBalanceDeletedOperation,
} = require("../services/balance.service");

/* Se crea un objeto control al cual se le agregaran
las funciones controladoras para las peticiones */
const control = {};

/* ---------------------- SHOW_LAST_OPERATIONS ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [GET].../api/operation y que permite obtener las ultimas 10 
    operaciones registradas en la db de acuerdo a la fecha */
control.showLastOperations = async (req, res) => {
  try {
    /* Se obtiene el id del usuario desde los parametros de 
        la url del endpoint */
    const { userId } = req.params;
    /* Se realiza la query para obtener las operaciones */
    const operations = await pool.query(
      `SELECT * FROM operations WHERE user_id='${userId}' ORDER BY date_registered DESC LIMIT 10`
    );
    /* Se envia al cliente la respuesta con las operationes obtenidas */
    res.status(200).json({
      data: {
        operations: operations,
      },
    });
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);

    /* Si ocurrio un error se envia una respuesta al 
        cliente con el error */
    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- ADD_OPERATIONS ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [POST].../api/operation y que permite registrar en la db una 
    nueva operacion */
control.addOperation = (req, res) => {
  /* Se obtiene el id del usuario desde los parametros de 
      la url del endpoint */
  const { userId } = req.params;
  /* Se obtienen desde el body de la peticion los datos 
      de la operacion a registrar */
  const { concept, amount, date_registered, type_operation } = req.body;

  /* Se calcula el id correspondiente al tipo de operacion. 
      El id es 1 si la operacion es de tipo Ingreso 
      y 2 si es de tipo Egreso */
  const type_operation_id = type_operation === "Egreso" ? 2 : 1;

  /* Se crea un objeto con los datos de la operacion 
      a registrar en la db */
  const newOperation = {
    concept,
    amount,
    date_registered,
    type_operation_id,
    user_id: userId,
  };

  /* Se realiza la query para registrar la operacion */
  pool.query(`INSERT INTO operations SET ?`, [newOperation], (err, result) => {
    if (err) {
      console.error(err.code);
      console.error(err.sqlMessage);

      /* Si ocurrio un error se envia una respuesta al 
          cliente con el error */
      res.status(500).json({
        message: "Internal server error",
        error_code: err.code,
        sql_message: err.sqlMessage,
      });
    } else {
      /* Se actualiza el balance usando el monto de operacion registrada */
      editBalanceCreatedOperation(userId, amount, type_operation).then(resMysql =>
        /* Se envia al cliente la respuesta con los datos 
            de la operacion registrada */
        res.status(201).json({
          message: "Operation saved successfully",
          data: newOperation,
        })
      );
    }
  });
};
/* ------------------------------------------------------------ */

/* ---------------------- DELETE_OPERATION ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [DELETE].../api/operation y que permite eliminar de la db una 
    nueva operacion */
control.deleteOperation = async (req, res) => {
  /* Se obtiene el id desde los parametros de 
      la url del endpoint */
  const { idOperation } = req.params; //id de la operacion

  try {
    /* Se recupera desde la db la operacion a eliminar */
    const operation = await pool.query(
      `SELECT amount, type_operation_id, user_id from operations WHERE id='${idOperation}'`
    );
    /* Se recupera el monto de la operacion a eliminar */
    const amount = operation[0].amount;
    /* Se recupera el user_id de la operacion a eliminar */
    console.log(operation[0].user_id)
    const user_id = operation[0].user_id;

    /* Se calcula la description correspondiente al tipo de operacion */
    const type_operation =
      operation[0].type_operation_id === 1 ? "Ingreso" : "Egreso";

    /* Se elimina la operacion de la db */
    const resMysql = await pool.query(
      `DELETE FROM operations WHERE id=${idOperation}`
    );

    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      /* Se actualiza el balance usando el monto y el tipo de la  
          operacion eliminada */
      editBalanceDeletedOperation(user_id, amount, type_operation);
      /* Se envia al cliente la respuesta confirmando 
          la eliminacion de la operacion*/
      res.json({ message: "Operation removed successfully" });
    }
  } catch (err) {
    /* Si ocurrio un error se envia una respuesta al 
        cliente con el error */
    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- UPDATE_OPERATION ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [PUT].../api/operation y que permite actualizar los datos 
    de una operacion */
control.updateOperation = async (req, res) => {
  /* Se obtiene el id desde los parametros de 
      la url del endpoint */
  const { idOperation } = req.params; //id de la operacion

  /* Se obtienen desde el body de la peticion los datos 
      de la operacion a actualizar */
  const { concept, amount, date_registered } = req.body;

  /* Se crea un objeto con los datos a actulizar en la operacion */
  const newOperation = {
    concept,
    amount,
    date_registered,
  };

  console.log(idOperation, concept, amount, date_registered);

  try {
    /* Se recupera desde la db la operacion a actualizar */
    const prevOperation = await pool.query(
      `SELECT amount, user_id from operations WHERE id='${idOperation}'`
    );
    /* Se recupera el monto previo de la operacion a actualizar */
    const prevAmount = prevOperation[0].amount;
    /* Se recupera el user_id de la operacion a actualizar */
    const user_id = prevOperation[0].user_id;

    /* Se actualiza la operacion con los datos nuevos */
    const resMysql = await pool.query(
      `UPDATE operations SET ? WHERE id='${idOperation}'`,
      [newOperation]
    );
    /* Si no se encontro una operacion con el id consultado se envia 
        una respuesta al cliente con el codigo http 400 */
    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      /* Se recupera la operacion con los datos ya actualizados */
      const operationUpdated = await pool.query(
        `SELECT * from operations WHERE id='${idOperation}'`
      );
      /* Se calcula la description correspondiente al tipo de operacion */
      const type_operation =
        operationUpdated[0].type_operation_id === 1 ? "Ingreso" : "Egreso";

      /* Se actualiza el balance usando el monto previo de la operacion,
          su monto nuevo y su tipo */
      await editBalanceUpdatedOperation(
        user_id,
        prevAmount,
        amount,
        type_operation
      );

      /* Se envia una respuesta al cliente */
      res.status(201).json({
        message: "Operation updated successfully",
        data: { id: idOperation, amount, type_operation },
      });
    }
  } catch (err) {
    /* Si ocurrio un error se envia una respuesta al 
        cliente con el error */
    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- SHOW_ENTRIES_OPERATIONS ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [GET].../api/operation/entries y que permite obtener las 
    operaciones de tipo "Ingreso" */
control.showEntriesOperations = async (req, res) => {
  try {
    /* Se obtiene el id del usuario desde los parametros de 
        la url del endpoint */
    const { userId } = req.params;
    /* Se realiza la query para obtener las operaciones */
    const operations = await pool.query(
      `SELECT * FROM operations WHERE type_operation_id='1' AND user_id='${userId}' ORDER BY date_registered DESC`
    );
    /* Se envia al cliente la respuesta con las operationes obtenidas */
    res.json({
      data: {
        operations,
      },
    });
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);

    /* Si ocurrio un error se envia una respuesta al 
        cliente con el error */
    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- SHOW_OUTPUTS_OPERATIONS ---------------------- */
/* Esta funcion es la controladora para las peticiones al endpoint
    [GET].../api/operation/outputs y que permite obtener las 
    operaciones de tipo "Egreso" */
control.showOutputsOperations = async (req, res) => {
  try {
    /* Se obtiene el id del usuario desde los parametros de 
        la url del endpoint */
    const { userId } = req.params;
    /* Se realiza la query para obtener las operaciones */
    const operations = await pool.query(
      `SELECT * FROM operations WHERE type_operation_id='2' AND user_id='${userId}' ORDER BY date_registered DESC`
    );
    /* Se envia al cliente la respuesta con las operationes obtenidas */
    res.json({
      data: {
        operations,
      },
    });
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);

    /* Si ocurrio un error se envia una respuesta al 
        cliente con el error */
    res.status(500).json({
      message: "Internal server error",
      error_code: err.code,
      sql_message: err.sqlMessage,
    });
  }
};
/* ------------------------------------------------------------ */

/* Se exporta el objeto "control" con todas 
    las funciones controladoras */
module.exports = control;
