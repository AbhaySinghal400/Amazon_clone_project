const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET || 'supersecretkey123',
  { expiresIn: '30d' },
);

const userResponse = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || 'customer',
  token: generateToken(user._id),
});

const registerUser = async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (!['customer', 'seller'].includes(role)) {
    return res.status(400).json({ message: 'Invalid account type' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    return res.status(201).json(userResponse(user));
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && await user.matchPassword(password)) {
      return res.json(userResponse(user));
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { registerUser, loginUser };
