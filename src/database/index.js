var mysql = require('mysql2');
const Logger = require('../logger');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = require('../variables');

class Database {
	constructor() {
		try {
			this.connection = mysql.createConnection({
				host           : MYSQL_HOST,
				port           : MYSQL_PORT,
				user           : MYSQL_USER,
				password       : MYSQL_PASS,
				database       : MYSQL_DB,
				connectTimeout : 30000,
			});
		} catch(err) {
			Logger.error(err);
			throw err;
		}
	}
	async connect(retries=6) {
		return new Promise((resolve, reject) => {
			this.connection.connect((err) => {
				if (err) {
					Logger.warn("Failed to connect to the database.");
					if (retries > 0) {
						setTimeout(() => this.connect(retries-1).then(resolve).catch(reject), 10000);
					} else {
						reject(err);
					}
				} else {
					Logger.info("Database connected with success.");
					resolve();
				}
			});
		});
	}
	getUser(id) {
		return new Promise((resolve, reject) => {
			this.connection.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
				if (err) reject(err);
				if (result.length == 0) {
					Logger.warn("User not found");
					return resolve(null);
				}
				resolve(result[0]);
			})
		})
	}
	insertTask(summary, date, userId) {
		return new Promise((resolve, reject) => {
			this.connection.query('INSERT INTO tasks(summary, date, user_id) values(?, ?, ?)', [summary, date, userId], (err, results) => {
				if (err) reject(err);
				resolve(results);
			})
		})
	}
	updateTask(taskId, summary, date, userId) {
		return new Promise((resolve, reject) => {
			this.connection.query('UPDATE tasks SET summary = ?, date = ?, user_id = ? WHERE id = ?', [summary, date, userId, taskId], (err, results) => {
				if (err) reject(err);
				resolve(results);
			})
		})
	}
	getTasks(userId) {
		return new Promise((resolve, reject) => {
			this.connection.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
				if (err) reject(err);
				resolve(results);
			})
		})
	}
	getTask(taskId) {
		return new Promise((resolve, reject) => {
			this.connection.query('SELECT * FROM tasks WHERE id = ?', [taskId], (err, results) => {
				if (err) reject(err);
				if (results.length == 0) {
					Logger.warn("User not found");
					return resolve(null);
				}
				resolve(results[0]);
			})
		})
	}
}

module.exports = new Database();