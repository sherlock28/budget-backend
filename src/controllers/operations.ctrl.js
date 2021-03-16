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
      sqlMessage: err.sqlMessage,
    });
  }
};

control.add = (req, res) => {
  const { concept, amount, date_registered, type_operation_id } = req.body;

  const newOperation = {
    concept,
    amount,
    date_registered,
    type_operation_id,
  };

  const resMySql = pool.query(
    `INSERT INTO operations SET ?`,
    [newOperation],
    (err, result) => {
      if (err) {
        console.error(err.code);
        console.error(err.sqlMessage);

        res.status(500).json({
          message: "Internal server error",
          error_code: err.code,
          sqlMessage: err.sqlMessage,
        });
      } else {
        newOperation.id = result.insertId;
        res.status(201).json({
          message: "Operation saved successfully",
          data: newOperation,
        });
      }
    }
  );
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
      sqlMessage: err.sqlMessage,
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
    const resMysql = await pool.query(`UPDATE operations SET ? WHERE id='${id}'`, [newOperation]);
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
      sqlMessage: err.sqlMessage,
    });
  }
};

control.showEntries = (req, res) => {
  res.json({ message: "show entry operations" });
};

control.showOutputs = (req, res) => {
  res.json({ message: "show output operations" });
};

control.showGetById = (req, res) => {
 const { id } = req.params.id;

 pool.query(`SELECT * FROM operations WHERE id=${id}`);
 res.json({ message: "show operation by ID" });
};

module.exports = control;
