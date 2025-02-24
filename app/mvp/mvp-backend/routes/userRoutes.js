const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser } = require("../controllers/userController");

// Define routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;