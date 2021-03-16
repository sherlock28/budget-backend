const pool = require("../database");

const control = {};

control.showLast = async (req, res) => {
  try {
    const operations = await pool.query(
      "SELECT * FROM operations ORDER BY registred_date DESC LIMIT 10 "
    );

    res.status(200).json({
      data: {
        operations: operations,
      },
    });
  } catch (err) {
    console.error(err.code);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

control.add = (req, res) => {
  res.json({ message: "create operation" });
};

control.delete = (req, res) => {
  res.json({ message: "delete operation" });
};

control.update = (req, res) => {
  res.json({ message: "update operation" });
};

control.showEntries = (req, res) => {
  res.json({ message: "show entry operations" });
};

control.showOutputs = (req, res) => {
  res.json({ message: "show output operations" });
};

control.showGetById = (req, res) => {
  console.log(req.params.id);
  res.json({ message: "show operation by ID" });
};

module.exports = control;
