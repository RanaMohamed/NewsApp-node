const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const validateRequest = require('../middlewares/validateRequest');
const User = require('../models/user');
const authenticate = require('../middlewares/authentication');

router.post('/register', async (req, res) => {
	const { fullname, email, password } = req.body;
	const user = new User({ fullname, email, password });

	await user.save();

	const token = await user.generateToken();

	res
		.status(201)
		.json({ message: 'User registered successfully', user, token });
});

router.post(
	'/login',
	validateRequest([
		body('email').exists().withMessage('Email is required'),
		body('password').exists().withMessage('Password is required'),
	]),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user)
			return res.status(401).json({
				message: 'Invalid email or password',
				errors: { errors: { login: 'Invalid email or password' } },
			});

		const isMatched = await user.checkPassword(password);
		if (!isMatched)
			return res.status(403).json({
				message: 'Invalid email or password',
				errors: { errors: { login: 'Invalid email or password' } },
			});

		const token = await user.generateToken();
		res.json({ user, token });
	}
);

router.get('/', authenticate, async (req, res) => {
	res.json({ user: req.user });
});

module.exports = router;
