const express = require('express');
var bodyParser = require('body-parser')
const Logger = require('./logger');
const Database = require('./database');
const { EXPRESS_PORT } = require('./variables');
const { getUser } = require('./middlewares/users');

const start = async () => {
	await Database.connect();
	
	const app = express();
	app.use(bodyParser.json());
	app.use(getUser);

	app.post(
		'/task',
		async (req, res) => {
			if (req.user.role == "Technician" && req.body.targetUserId != req.user.id) {
				return res.status(401).send({
					isError: true,
					message: "Only managers can add tasks to other technicians"
				});
			}
			const result = await Database.insertTask(req.body.summary, new Date(Number(req.body.date)), req.body.targetUserId);
			res.json(await Database.getTask(result.insertId));
		}
	);
	app.put(
		'/task',
		async (req, res) => {
			const task = await Database.getTask(req.body.taskId);
			if (task.user_id != req.user.id && req.user.role == "Technician") {
				return res.status(401).send({
					isError: true,
					message: "Only managers can update other technicians tasks"
				});
			}
			await Database.updateTask(req.body.taskId, req.body.summary, new Date(Number(req.body.date)), req.body.userId);
			res.json(await Database.getTask(req.body.taskId));
		}
	);
	app.get(
		'/task/:taskId',
		async (req, res) => {
			Logger.info(JSON.stringify(req.params));
			if (req.params.taskId) {
				const task = await Database.getTask(req.params.taskId);
				if (task.user_id != req.user.id && req.user.role == "Technician") {
					return res.status(401).send({
						isError: true,
						message: "Only managers can retrieve other technicians tasks"
					});
				}
				return res.json(task);
			}
			res.json(await Database.getTasks(req.body.userId));
		}
	);
	app.get(
		'/task',
		async (req, res) => {
			res.json(await Database.getTasks(req.body.userId));
		}
	);
	app.listen(EXPRESS_PORT, () => {
		Logger.info(`Application running at port ${EXPRESS_PORT}`);
	});
};

start();