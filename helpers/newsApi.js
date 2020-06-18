const NewsAPI = require('newsapi');
const { newsApiKey } = require('../config');
const newsapi = new NewsAPI(newsApiKey);

module.exports = newsapi.v2;
