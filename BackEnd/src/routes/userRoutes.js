const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken")
const {getUsers,createUser,updateUser} = require("../controllers/userController");


router.get("/users",authenticateToken,getUsers);
router.post(
  "/users",
  authenticateToken,
  createUser
);
router.put("/users/:userId",authenticateToken, updateUser);
module.exports = router;