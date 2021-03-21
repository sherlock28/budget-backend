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
/* ------------------------------------------------------------ */

module.exports = control;
