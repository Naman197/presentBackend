const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SECRET = "your_jwt_secret_key"; // Use env variable in production

exports.signup = async (req, res) => {
  try {
    const { username, password, role, email, fullName } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ error: "Username already taken" });

    const user = await User.create({ username, password, role, email, fullName });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
