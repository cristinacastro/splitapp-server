const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const User = require("../models/User");

const withAuth = require("../helpers/middleware");

/**
 * @route   GET home
 * @desc    Load home
 * @access  Public
 */

// accedemos a una ruta privada usando el middleware withAuth que nos devuelva un json que diga en string algo
router.get("/home", withAuth, function (req, res, next) {
  res.json("Protected route");
});

/**
 * @route   POST signup
 * @desc    Register new user
 * @access  Public
 */

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
    try {
    // chequea si el email ya existe en la BD
    const emailExists = await User.findOne({ email }, "email");
    // si el usuario ya existe, devuelve un error
    if (emailExists) {
      return res.status(400).json({ errorMessage: "Email already exists!" });
    } else {
      // en caso contrario, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = await User.create({ email, password: hashPass });

      // definimos el payload que enviaremos junto con el token
      const payload = { email };
      // creamos el token usando el método sign, el string de secret session y el expiring time
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      // enviamos en la respuesta una cookie con el token
      // Este método de emisión de tokens es ideal para un entorno de navegador porque establece una cookie httpOnly que ayuda a proteger al cliente de ciertas vulnerabilidades como XSS.
      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    }
  } catch (error) {
//Le decimos que siga
next(error);
  }
});
/**
 * @route   POST login
 * @desc    Login user
 * @access  Public
 */

router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    // revisa si el usuario existe en la BD
    const user = await User.findOne({ email });
    // si el usuario no existe, devuelve un error
    if (!user) {
      return res.status(404).json({ errorMessage: "User does not exist!" });
    }
    // si el usuario existe, hace hash del password y lo compara con el de la BD
    // si coincide, creamos el token usando el método sign, el string de secret session y el expiring time
    // enviamos en la respuesta una cookie con el token
    else if (bcrypt.compareSync(password, user.password)) {
      // Issue token
      const payload = { email };
      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    } else {
      return res.status(401).json({ errorMessage: "Password does not match!" });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET logout
 * @desc    Logout user
 * @access  Private
 */

// para hacer logout, configuramos un valor cualquiera para reemplazar el token
router.get("/logout", withAuth, function (req, res) {
  // seteamos el token con un valor vacío y una fecha de expiración en el pasado (Jan 1st 1970 00:00:00 GMT)
  res.cookie("token", "", { expires: new Date(0) });
  return res.status('200').json({
    message: "signed out"
  })
});

/**
 * @route   GET me
 * @desc    Get user data
 * @access  Private
 */

// obtenemos los datos del usuario
router.get("/me", withAuth, async function (req, res) {
  try {
    // si el token valida en el middleware withAuth, tenemos disponible el email del usuario en req.email
    const user = await User.findOne({ email: req.email }).select("-password");
    // devolvemos el usuario
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
