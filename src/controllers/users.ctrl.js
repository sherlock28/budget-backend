const pool = require("../database");
const control = {};

control.signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(`SELECT * FROM users WHERE email='${email}'`);

  if (user.length === 0) {
    /* Se realiza la query para registrar la operacion */
    pool.query(
      `INSERT INTO users SET ?`,
      [{ email, password }],
      (err, result) => {
        if (err) {
          /* Si ocurrio un error se envia una respuesta al 
              cliente con el error */
          res.status(500).json({
            message: "Internal server error",
            error_code: err.code,
            sql_message: err.sqlMessage,
          });
        } else {
          /* Se envia al cliente la respuesta confirmando 
              el registro del usuario */
          res.status(201).json({
            message: "User created successfully",
          });
        }
      }
    );
  } else {
    res.status(400).json({ error: "The email is already in use" });
  }
};

control.signin = (req, res) => {
  res.send("signin");
};

control.signout = (req, res) => {
  res.send("signout");
};

module.exports = control;
