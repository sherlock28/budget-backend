const pool = require("../database");

const control = {};

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
      newOperation.id = result.insertId;
      res.status(201).json({
        message: "Operation saved successfully",
        data: newOperation,
      });
    }
  });
};

control.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const resMysql = await pool.query(`DELETE FROM operations WHERE id=${id}`);
    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
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

control.update = async (req, res) => {
  const { id } = req.params;
  const { concept, amount, date_registered } = req.body;

  const newOperation = {
    concept,
    amount,
    date_registered,
  };

  try {
    const resMysql = await pool.query(
      `UPDATE operations SET ? WHERE id='${id}'`,
      [newOperation]
    );
    if (resMysql.affectedRows === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      newOperation.id = id;
      res.status(201).json({
        message: "Operation updated successfully",
        data: newOperation,
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

control.showEntries = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations WHERE type_operation_id='1'"
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

control.showOutputs = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations WHERE type_operation_id='2'"
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

control.showById = async (req, res) => {
  const { id } = req.params;

  try {
    const operation = await pool.query(
      `SELECT * FROM operations WHERE id='${id}';`
    );

    if (operation.length === 0) {
      res.status(400).json({ message: "Id not found" });
    } else {
      res.json({
        data: {
          operation: operation[0],
        },
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
