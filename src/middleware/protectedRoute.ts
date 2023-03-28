const jwt = require('jsonwebtoken');

export const protectedRoute = async (req, res, next) => {
	let token;
	const authHeader = req.headers.Authorization || req.headers.authorization;
	if (!authHeader) {
		res.status(404).send({ message: 'unathorized' });
	}
	if (authHeader && authHeader.startsWith('Bearer')) {
		token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				res.status(401).send({ error: err.message });
			}
			req.user = decoded.user;
			next();
		});

		if (!token) {
			res.status(401).send({ error: 'User is not authorized or token is missing' });
			throw new Error('User is not authorized or token is missing');
		}
	}
};
