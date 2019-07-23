const axios = require('axios');

module.exports = {
	name: 'subscribe',
	description: 'Subscribe to notification',
	args: false,
	async execute(bot, ctx) {
		const response = await axios.post(`${process.env.API_SERVER}/api/addsubscriber`, {
			id: ctx.from.id,
			name: ctx.from.first_name
		});

		if (!response.data.message) return ctx.reply('You have successfully subscribed to announcements');
		return ctx.reply(response.data.message);
	}
};
