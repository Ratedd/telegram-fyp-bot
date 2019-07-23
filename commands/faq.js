const axios = require('axios');
const { stripIndents } = require('common-tags');

module.exports = {
	name: 'faq',
	description: 'Sends the faq you specified',
	args: '<faqIndex>',
	async execute(bot, ctx) {
		const args = ctx.message.text.slice('/'.length).trim().split(/ +/g);
		args.shift().toLowerCase();
		if (!args.length) {
			return ctx.reply(stripIndents`You need to provide a keyword to search with.
			Usage: /faq <faqIndex>
			`);
		}
		const index = args[0];
		const response = await axios.post(`${process.env.API_SERVER}/api/getfaq`, {
			moduleCode: index
		});
		const { data } = response;
		let qNaString = '';
		for (let i = 0; i < data.questions.length; i++) {
			qNaString += `#${i + 1} ${data.questions[i]}\r\nAns: ${data.answers[i]}\r\n\r\n`;
		}
		const message = stripIndents`FAQ #${data.id}
		Associated moduleCode: ${data.moduleCode}
		
		${qNaString}
		FAQ Keywords: ${data.keywords.keywords.join(', ')}
		`;

		return ctx.reply(message);
	}
};
