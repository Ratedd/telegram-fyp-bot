const axios = require('axios');

module.exports = {
	name: 'faq',
	description: 'Sends the faq you specified',
	args: '<faqIndex>',
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const args = ctx.message.text.slice('/'.length).trim().split(/ +/g);
		args.shift().toLowerCase();
	}
};
