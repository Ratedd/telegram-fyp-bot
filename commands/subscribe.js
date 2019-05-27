const fetch = require('node-fetch');

module.exports = {
	name: 'subscribe',
	description: 'Subscribe to notification',
	args: false,
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const subscriberInfo = {
			id: ctx.from.id,
			name: ctx.from.first_name
		};
		const data = await fetch(`${process.env.API_SERVER}/api/addsubscriber`, { method: 'POST', body: JSON.stringify(subscriberInfo) })
			.then(res => res.json());

		if (!data.message) return ctx.reply('You have successfully subscribed to announcements');
		return ctx.reply(data.message);
	}
};
