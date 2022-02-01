module.exports = {
	MYSQL_HOST:   process.env.MYSQL_HOST,
	MYSQL_PORT:   process.env.MYSQL_PORT,
	MYSQL_USER:   process.env.MYSQL_USER,
	MYSQL_PASS:   process.env.MYSQL_PASS,
	MYSQL_DB:     process.env.MYSQL_DB,
	EXPRESS_PORT: Number(process.env.EXPRESS_PORT),
	AMQP_URL:    'amqp://localhost:5673'
};

console.log(JSON.stringify(module.exports));