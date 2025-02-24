const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Fetch all users or search results
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { username: { $regex: search, $options: "i" } } : {};
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch a specific user’s bio
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user profile
const createUser = [
  body("username").isString().notEmpty(),
  body("bio").isString().optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, bio } = req.body;
      const user = new User({ username, bio });
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
];

// Update a user’s bio
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { bio: req.body.bio },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser };