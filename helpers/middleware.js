const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_SESSION;

const withAuth = function (req, res, next) {
  // obtenemos el token de las cookies a través del objecto request
  const token = req.cookies.token;
  // si no hay token, devolvemos un error
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    // verificamos el token
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        // si hay un error, devolvemos un mensaje
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        // si el token valida, configuramos req.email con el valor del decoded email
        req.email = decoded.email;
        next();
      }
    });
  }
};

module.exports = withAuth;

