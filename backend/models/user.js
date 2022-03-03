const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

// modèle utilisateur 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// éviter que deux utilisateurs utilisent la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", userSchema);
