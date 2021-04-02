/* Este archivo define y exporta una funcion que permite verificar 
la validez del token */
const pool = require("../database");
const jwt = require("jsonwebtoken");

/* Funcion que permite validar el token */
const TokenValidation = async (req, res, next) => {
  /* Se obtiene el token recibido */
  const token = req.header("authorization");
  /* Se comprueba que se haya recibido el token */
  if (!token) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  try {
    /* Utilizando jwt se verifica el token y se obtiene su contenido */
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    /* Con los datos obtenidos del token se verifica que el mismo
        pertenece al usuario consultando en la db */
    const session = pool.query(
      `SELECT * FROM sessions WHERE token='${token}' and user_id=${decoded.user_id}`
    );
    /* Si la consulta anterio devuelve null significa que el token no pertece al  usuario o bien que el usuario no esta logueado y por lo tanto no tiene su token registrado en la db */
    if (session == null) {
      return res.status(401).json({
        error: "Access denied",
      });
    } 
    /* Para pasar a al siguiente middleware */
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

module.exports = TokenValidation;
