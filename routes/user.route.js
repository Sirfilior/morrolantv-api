const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const jwtCheck = require("./auth");

router.get("/", jwtCheck, userController.getInfo);

router.get("/userNodes", userController.getNodesForUser);

router.post("/userNodes", jwtCheck, userController.saveUserNodes);

module.exports = router;
