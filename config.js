require('dotenv').config();

const requiredEnvs = ['JWT_SECRET', 'DB_URI', 'NEWS_API_KEY'];

const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length) {
	throw new Error(`Missing required envs ${missingEnvs}`);
}

module.exports = {
	saltRounds: process.env.SALT_ROUNDS || 7,
	port: process.env.PORT || 3000,
	jwtSecret: process.env.JWT_SECRET,
	dbUri: process.env.DB_URI,
	newsApiKey: process.env.NEWS_API_KEY,
};
