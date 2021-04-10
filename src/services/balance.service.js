/* Se importa la conexion a la base de datos */
const pool = require("../database");

/* ---------------------- UPDATE_BALANCE ---------------------- */
/* Esta funcion actualiza el balance cuando una nueva operacion
es creada */
const editBalanceCreatedOperation = async (user_id, amount, type_operation) => {
  try {
    let newBalance = 0;

    /* Se recupera el balance anterior */
    const balance = await pool.query(
      `SELECT * from balances WHERE user_id='${user_id}'`
    );
    const { last_balance } = balance[0];

    /* Se calcula el nuevo balance teniendo en cuanta que
       tipo de operacion que fue creado */
    type_operation === "Ingreso"
      ? (newBalance = last_balance + parseFloat(amount))
      : (newBalance = last_balance - parseFloat(amount));

    /* Se actualiza el balance en la db con el 
        nuevo balance calculado */
    const resMysql = await pool.query(
      `UPDATE balances SET ? WHERE user_id='${user_id}'`,
      [{ last_balance: newBalance }]
    );
    if (resMysql.affectedRows === 0) {
      return console.log("Id not found");
    }
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- EDIT_BALANCE  ---------------------- */
/* ---------------- WHEN A OPERATION IS UPDATED  ---------------- */
/* Esta funcion actualiza el balance cuando una operacion
es editada */
const editBalanceUpdatedOperation = async (
  user_id,
  prevAmount,
  newAmount,
  type_operation
) => {
  try {
    let newBalance = 0;

    /* Se recupera el balance anterior */
    const balance = await pool.query(
      `SELECT * from balances WHERE user_id='${user_id}'`
    );
    const { last_balance } = balance[0];

    /* Se calcula el nuevo balance teniendo en cuanta que
       tipo de operacion fue la que edito */
    if (type_operation === "Ingreso") {
      const diff = newAmount - prevAmount;
      newBalance = last_balance + diff;
    } else {
      const diff = prevAmount - newAmount;
      newBalance = last_balance + diff;
    }

    /* Se actualiza el balance en la db */
    const resMysql = await pool.query(
      `UPDATE balances SET ? WHERE user_id='${user_id}'`,
      [{ last_balance: newBalance }]
    );

    if (resMysql.affectedRows === 0) {
      return console.log("Id not found");
    }
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- EDIT_BALANCE  ---------------------- */
/* ---------------- WHEN A OPERATION IS DELETED  ---------------- */
/* Esta funcion actualiza el balance cuando una operacion
es eliminada */
const editBalanceDeletedOperation = async (user_id, amount, type_operation) => {
  try {
    let newBalance = 0;

    /* Se recupera el balance anterior */
    const balance = await pool.query(
      `SELECT * from balances WHERE user_id='${user_id}'`
    );
    const { last_balance } = balance[0];

    /* Se calcula el nuevo balance teniendo en cuanta que
       tipo de operacion fue la que edito */
    if (type_operation === "Ingreso") {
      newBalance = last_balance - amount;
    } else {
      newBalance = last_balance + amount;
    }

    /* Se actualiza el balance en la db*/
    const resMysql = await pool.query(
      `UPDATE balances SET ? WHERE user_id='${user_id}'`,
      [{ last_balance: newBalance }]
    );
    if (resMysql.affectedRows === 0) {
      return console.log("Id not found");
    }
  } catch (err) {
    console.error(err.code);
    console.error(err.sqlMessage);
  }
};
/* ------------------------------------------------------------ */

/* ---------------------- CREATE_BALANCE  ---------------------- */
/* ---------------- WHEN AN USER IS CREATED  ---------------- */
/* Esta funcion crean un registro de balance cuando un usuario
es creado */
const createBalance = async (email) => {
  const userSaved = await pool.query(
    `SELECT id FROM users WHERE email='${email}'`
  );
  const user_id = userSaved[0].id;
  await pool.query(`INSERT INTO balances SET ?`,[{ last_balance: 0, user_id }]);
}

/* Se exportan la tres funciones que actulizan el balance */
exports.editBalanceUpdatedOperation = editBalanceUpdatedOperation;
exports.editBalanceDeletedOperation = editBalanceDeletedOperation;
exports.editBalanceCreatedOperation = editBalanceCreatedOperation;
exports.createBalance = createBalance;

