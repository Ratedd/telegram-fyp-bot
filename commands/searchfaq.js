const axios = require('axios');
const { stripIndents } = require('common-tags');

module.exports = {
	name: 'searchfaq',
	description: 'Search for FAQ with provided keyword',
	args: '<keyword>',
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const args = ctx.message.text.slice('/'.length).trim().split(/ +/g);
		args.shift().toLowerCase();
		if (!args.length) {
			return ctx.reply(stripIndents`You need to provide a keyword to search with.
			Usage: /searchfaq <keyword>
			`);
		}
		const response = await axios.post(`${process.env.API_SERVER}/api/searchfaqbykeyword`, { keyword: args[0] });
		if (!response.data.message) {
			let message = '';
			for (let i = 0; i < response.data.length; i++) {
				message += `/faq ${response.data[i].moduleCode}\r\n`;
			}
			return ctx.reply(message);
		}
		return ctx.reply(response.data.message);
	}
};
