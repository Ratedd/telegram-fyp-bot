const fetch = require('node-fetch');
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
		const searchDetails = {
			keyword: args[0]
		};
		const res = await fetch('http://localhost:3000/api/searchfaqbykeyword', { method: 'post', body: JSON.stringify(searchDetails) })
			.catch(err => bot.log.error('[Command - searchfaq]\n', err));
	
		const data = await res.json();
		if (!data.message) {
			let message = '';
			for (let i = 0; i < data.length; i++) {
				message += `/faq ${data[i].id}\r\n`
			}
			return ctx.reply(message);
		}
		return ctx.reply(data.message);
	}
};
