const pool = require("../database");

/* ---------------------- UPDATE_BALANCE ---------------------- */
const updateBalance = async (id, amount, type_operation) => {
  try {
    const balance = await pool.query(`SELECT * from balances WHERE id='${id}'`);

    const { last_balance } = balance[0];
    let newBalance = 0;

    type_operation === "Ingreso"
      ? (newBalance = last_balance + amount)
      : (newBalance = last_balance - amount);

    const resMysql = await pool.query(
      `UPDATE balances SET ? WHERE id='${id}'`,
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
const editBalanceUpdatedOperarion = async (
  idBalance,
  prevAmount,
  newAmount,
  type_operation
) => {
  try {
    let newBalance = 0;

    /* Se recupera el balance anterior */
    const balance = await pool.query(
      `SELECT * from balances WHERE id='${idBalance}'`
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

    /* Se actualiza el balance en la db*/
    const resMysql = await pool.query(
      `UPDATE balances SET ? WHERE id='${idBalance}'`,
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
const editBalanceDeletedOperarion = async (
  idBalance,
  amount,
  type_operation
) => {
  try {
    let newBalance = 0;

    /* Se recupera el balance anterior */
    const balance = await pool.query(
      `SELECT * from balances WHERE id='${idBalance}'`
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
      `UPDATE balances SET ? WHERE id='${idBalance}'`,
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

exports.editBalanceUpdatedOperarion = editBalanceUpdatedOperarion;
exports.editBalanceDeletedOperarion = editBalanceDeletedOperarion;
exports.updateBalance = updateBalance;
