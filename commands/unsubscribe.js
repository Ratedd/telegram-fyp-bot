const axios = require('axios');

module.exports = {
	name: 'unsubscribe',
	description: 'Subscribe to notification',
	args: false,
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const response = await axios.delete(`${process.env.API_SERVER}/api/removesubscriber/${ctx.from.id}`);

		if (!response.data.message) return ctx.reply('You have successfully unsubscribed to announcements');
		return ctx.reply(response.data.message);
	}
};
