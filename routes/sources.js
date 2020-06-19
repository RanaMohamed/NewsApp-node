const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authentication');
const NewsAPI = require('../helpers/newsApi');

router.get('/', authenticate, async (req, res) => {
	const result = await NewsAPI.sources();

	const sources = result.sources.map((source) => ({
		...source,
		subscribed:
			req.user.sources.findIndex((s) => source.id == s) !== -1 ? true : false,
	}));

	res.json(sources);
});

router.post('/subscribe/:id', authenticate, async (req, res) => {
	const user = req.user;

	const index = user.sources.findIndex((source) => source === req.params.id);
	if (index !== -1)
		return res.status(400).json({ message: 'Source already subscribed' });

	user.sources.push(req.params.id);
	await user.save();
	res.json({ message: 'Source subscribed successfully' });
});

router.post('/unsubscribe/:id', authenticate, async (req, res) => {
	const user = req.user;

	const index = user.sources.findIndex((source) => source === req.params.id);
	if (index === -1)
		return res.status(400).json({ message: 'Source already unsubscribed' });

	user.sources.pull(req.params.id);
	await user.save();
	res.json({ message: 'Source unsubscribed successfully' });
});

module.exports = router;
