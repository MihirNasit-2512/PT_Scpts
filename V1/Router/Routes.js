const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const adminController = require("../Controller/adminController");
const { verifyToken } = require("../Middleware/jwtVerify");
const { validateRegister, validateLogin } = require("../Middleware/validator");

router.post("/register", validateRegister, userController.register);

router.post("/login", validateLogin, userController.login);

router.post("/addAdmin", verifyToken, adminController.addUser);

router.post("/addUser", verifyToken, adminController.addUser);

router.post("/updateUser/:id", verifyToken, adminController.updateUser);

router.post("/deleteUser/:id", verifyToken, adminController.deleteUser);

router.get(
  "/getUsersWithManager",
  verifyToken,
  adminController.getUsersWithManager
);

router.get("/getUsers", verifyToken, adminController.getUsers);

router.get("/getUserByToken", verifyToken, userController.getUserByToken);

module.exports = router;
