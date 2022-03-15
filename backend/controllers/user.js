const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const User = require("../models/user");



const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

/////////////////////////// ///

exports.signup = async (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) {
    return res
      .status(401)
      .json({ message: "Veuillez entrer une adresse email valide" });
  }

  if (!passwordSchema.validate(req.body.password)) {
    return res.status(401).json({
      message:
        "Pas d'espace, longueur entre 8 et 20 caractères, minimum 1 chiffre, 1 minuscule et 1 majuscule",
    });
  }
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Cet email est déjà utilisé !" });
  }
};


exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
