require('dotenv').config()

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expAutoSan = require('express-autosanitizer');
const rateLimit = require("express-rate-limit");

const indexRoutes = require("./routes/index")
const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

const app = express();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300
});

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to database!");
}).catch((err) => {
  console.log("Connection failed!");
  console.log(err)
});
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expAutoSan.all);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  next();
});

app.use("/api", indexRoutes)
app.use("/api/products", productsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);

module.exports = app;