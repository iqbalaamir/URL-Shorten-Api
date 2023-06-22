const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Other code...

exports.registerUser = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const user = new User({ email, firstName, lastName, password });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        await user.save();

        const activationLink = `http://localhost:3000/activate-account/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Activate Account',
            text: `Click on the following link to activate your account: ${activationLink}`
        });

        res.status(200).json({ message: 'Registration successful, please check your email to activate your account' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset',
            text: `Click on the following link to reset your password: ${resetLink}`
        });

        res.status(200).json({ message: 'Reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        const { id } = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

        user.isActivated = true;
        await user.save();

        res.status(200).json({ message: 'Account activation successful' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

