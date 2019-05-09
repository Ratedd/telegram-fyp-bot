module.exports = {
	name: 'test',
	description: 'For testing purposes',
	args: false,
	execute(bot, ctx) { // eslint-disable-line no-unused-vars
		ctx.replyWithMarkdown('123');
	}
};
