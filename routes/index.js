const express = require("express");
const router = express.Router();

// router.post("", checkAuth, (req, res, next ) => {
router.get("", (req, res, next) => {
    res.status(200).json({
        message: 'Hello World!'
    });
});

router.get("/ping", (req, res, next) => {
    res.status(200).json({
        message: "Pong!"
    })
});

module.exports = router;