require('dotenv').config();

const fs = require('fs');
const express = require('express');
const server = express();
const { Counter, register } = require('prom-client');
const Telegraf = require('telegraf');
// const sentry = require('@sentry/node');

const commandFiles = fs.readdirSync('./commands');

// sentry.init({ dsn: process.env.SENTRY_DSN });

const prometheus = {
	commandUsageCounter: new Counter({ name: 'command_usage_count', help: 'Total command usage' }),
	register
};

server.get('/', (req, res) => {
	res.set('Content-Type', prometheus.register.contentType);
	res.end(prometheus.register.metrics());
});

server.listen(3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.log = require('./util/logger.js');
bot.commandCollection = new Map();

bot.start(ctx => ctx.reply('Hey there!'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	bot.commandCollection.set(command.name, command.description);

	bot.command(command.name, ctx => {
		prometheus.commandUsageCounter.inc();
		command.execute(bot, ctx);
	});
}

bot.help(ctx => {
	prometheus.commandUsageCounter.inc();
	let helpList = '';
	for (const [commandName, commandDesc] of bot.commandCollection.entries()) {
		helpList += `/${commandName} - ${commandDesc}\r\n`;
	}

	return ctx.replyWithMarkdown(helpList, Telegraf.Extra.webPreview(false));
}).catch(err => {
	bot.log.error(err);
	// sentry.captureException(err);
});

bot.launch().then(() => {
	bot.log.info('Bot has started.');
	// sentry.captureMessage('Telegram Bot has started.');
}).catch(err => {
	bot.log.error(err);
	// sentry.captureException(err);
});
