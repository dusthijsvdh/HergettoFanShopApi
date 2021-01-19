require('dotenv').config()

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
// const orderRoutes = require("./routes/order");

const app = express();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to database!");
}).catch((err) => {
  console.log("Connection failed!");
  console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  next();
});

app.use("/api/products", productsRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/order", orderRoutes);

module.exports = app;