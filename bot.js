require('dotenv').config();

const Telegraf = require('telegraf');
const sentry = require('@sentry/node');
const AWS = require('aws-sdk');
const express = require('express');
const server = express();
const { Counter, register } = require('prom-client');

const prometheus = {
	textCounter: new Counter({ name: 'text_count', help: 'Total text received' }),
	register
};

server.get('/metrics', (req, res) => {
	res.set('Content-Type', prometheus.register.contentType);
	res.end(prometheus.register.metrics());
});

AWS.config.update({
	region: process.env.REGION,
	endpoint: process.env.AWS_ENDPOINT
});

const dynamodb = new AWS.DynamoDB();

sentry.init({ dsn: process.env.SENTRY_DSN });

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.log = require('./util/logger.js');

bot.start(ctx => ctx.reply('Hey there!'));
bot.on('text', () => prometheus.textCounter.inc());

// let params = {
// 	TableName: 'Movies',
// 	KeySchema: [
// 		{ AttributeName: 'year', KeyType: 'HASH' },  // Partition key
// 		{ AttributeName: 'title', KeyType: 'RANGE' }  // Sort key
// 	],
// 	AttributeDefinitions: [
// 		{ AttributeName: 'year', AttributeType: 'N' },
// 		{ AttributeName: 'title', AttributeType: 'S' }
// 	],
// 	ProvisionedThroughput: {
// 		ReadCapacityUnits: 10,
// 		WriteCapacityUnits: 10
// 	}
// };
server.listen(3000);
bot.launch().then(() => {
	// dynamodb.createTable(params, (err, data) => {
	// 	if (err) {
	// 		bot.log.error(JSON.stringify(err, null, 2));
	// 	} else {
	// 		bot.log.info(JSON.stringify(data, null, 2));
	// 	}
	// });
	bot.log.info('Bot has started.');
	sentry.captureMessage('Telegram Bot has started.');
}).catch(err => {
	bot.log.error(err);
	sentry.captureException(err);
});
