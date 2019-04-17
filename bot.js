require('dotenv').config();

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Hi there!'));

bot.launch().then(() => {
	// TODO IMPLEMENT LOGGER
}).catch(err => {
	// TODO IMPLEMENT LOGGER
});
