const pool = require("../database");

const control = {};

control.getBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await pool.query(`SELECT * from balances WHERE id='${id}'`);
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

control.updateBalance = async (req, res) => {
  const { id } = req.params;
  const { amount, type_operation } = req.body;

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
      res.status(400).json({ message: "Id not found" });
    } else {
      res.json({
        message: "Balance updated successfully",
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

module.exports = control;
