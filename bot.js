require('dotenv').config();

const { stripIndents } = require('common-tags');
const express = require('express');
const server = express();
const { Counter, register } = require('prom-client');
const Telegraf = require('telegraf');
const sentry = require('@sentry/node');
const AWS = require('aws-sdk');

const prometheus = {
	commandUsageCounter: new Counter({ name: 'command_usage_count', help: 'Total command usage' }),
	register
};

server.get('/', (req, res) => {
	res.set('Content-Type', prometheus.register.contentType);
	res.end(prometheus.register.metrics());
});

sentry.init({ dsn: process.env.SENTRY_DSN });

server.listen(3000);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.log = require('./util/logger.js');

AWS.config.update({
	region: process.env.REGION,
	endpoint: process.env.AWS_ENDPOINT
});

const db = new AWS.DynamoDB();

bot.start(ctx => ctx.reply('Hey there!'));
bot.help(ctx => {
	prometheus.commandUsageCounter.inc();
	const helpList = stripIndents`Here are the list of commands available:
		/test - Test Command
	`;

	return ctx.replyWithMarkdown(helpList, Telegraf.Extra.webPreview(false));
}).catch(err => {
	bot.log.error(err);
	sentry.captureException(err);
});
bot.command('test', ctx => {
	prometheus.commandUsageCounter.inc();
	ctx.reply('Just a test command');
});
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
