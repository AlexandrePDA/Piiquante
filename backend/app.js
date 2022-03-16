require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');

const stuffRoutes = require("./routes/sauces");
const userRoutes = require('./routes/user');

// lié BD avec code => utilisation de Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.LINK_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// éviter les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// routes
app.use("/api/sauces", stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
