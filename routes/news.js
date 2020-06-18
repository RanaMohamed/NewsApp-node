const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authentication');
const NewsAPI = require('../helpers/newsapi');

router.get('/', authenticate, async (req, res) => {
	if (req.user.sources.length === 0 && !req.query.q)
		return res
			.status(400)
			.json({ message: 'You must subscribe to a source first' });

	const result = await NewsAPI.everything({
		sources: req.user.sources,
		q: req.query.q || '',
		pageSize: 12,
		page: req.query.page || 1,
	});

	res.json(result);
});

module.exports = router;
