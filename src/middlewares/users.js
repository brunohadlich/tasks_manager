const Database = require('../database');

module.exports = {
	getUser: async (req, res, next) => {
		const user = await Database.getUser(req.body.userId);
		req.user = user;
		if (!user) {
			return res.status(401).send({
				isError: true,
				message: `User ${req.body.userId} not found.`
			});
		}
		next();
	}
}