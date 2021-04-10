const pool = require("../database");
const jwt = require("jsonwebtoken");
const { encryptPassword, validatePassword } = require("../libs/helpers");
const { createBalance } = require("../services/balance.service");

const control = {};

control.signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query(`SELECT * FROM users WHERE email='${email}'`);

  if (user.length === 0) {
    /* Se realiza la encriptacion del password */
    const encryptPass = await encryptPassword(password);
    /* Se realiza la query para registrar la operacion */
    pool.query(
      `INSERT INTO users SET ?`,
      [{ email, password: encryptPass }],
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
          createBalance(email);
          /* Se envia al cliente la respuesta confirmando 
              el registro del usuario */
          res.status(201).json({
            message: "User created successfully",
          });
        }
      }
    );
  } else {
    res.status(400).json({ message: "The email is already in use" });
  }
};

control.signin = async (req, res) => {
  /* Se verifica el usuario con el email recibido esta registrado*/
  const user = await pool.query(
    `SELECT * FROM users WHERE email='${req.body.email}'`
  );

  if (user.length === 0) {
    res.status(400).json({
      message: "Credentials are invalid",
    });
  } else {
    /* Se llama la funcion validatePassword para comprobar que password
      recibido coincide con el password almacenado en la db*/
    const isCorrectPass = await validatePassword(
      req.body.password,
      user[0].password
    );

    if (!isCorrectPass) {
      res.status(400).json({ message: "Credentials are invalid" });
    } else {
      /* Se genera el token por medio de la funcion sign de jwt */
      const token = jwt.sign(
        {
          user_id: user[0].id,
          email: user[0].email,
        },
        process.env.TOKEN_KEY,
        { expiresIn: 86400 }
      ); // expira en 1 dia

      /* Se guarda el token generado para el usuario en la db */
      pool.query(
        `INSERT INTO sessions SET ?`,
        [{ user_id: user[0].id, token }],
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
            /* Se envia el token en la propiedad 'authorization' del header de la respuesta */
            // "Access-Control-Expose-Headers","Authorization"
            res
              .status(200)
              .header({
                authorization: token,
                "Access-Control-Expose-Headers": "Authorization",
              })
              .json({
                message: "You are authenticated",
              });
          }
        }
      );
    }
  }
};

control.signout = async (req, res) => {
  /* Se obtiene su token recibido en el header del request */
  const token = req.header("authorization");

  try {
    /* Se busca en la db a que session pertenece el token */
    const session = await pool.query(
      `SELECT * FROM sessions WHERE token='${token}'`
    );
    if (session.length === 0) {
      res.status(400).json({ message: "Invalid token" });
    } else {
      /* Se elimina la session de la db*/
      await pool.query(`DELETE FROM sessions WHERE token='${token}'`);
      res.json({ message: "You are sign out" });
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

module.exports = control;
