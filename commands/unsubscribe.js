const fetch = require('node-fetch');

module.exports = {
	name: 'unsubscribe',
	description: 'Subscribe to notification',
	args: false,
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const subscriberInfo = {
			id: ctx.from.id
		};
		const data = await fetch(`${process.env.API_SERVER}/api/removesubscriber`, { method: 'DELETE', body: JSON.stringify(subscriberInfo) })
			.then(res => res.json());

		if (!data.message) return ctx.reply('You have successfully unsubscribed to announcements');
		return ctx.reply(data.message);
	}
};
