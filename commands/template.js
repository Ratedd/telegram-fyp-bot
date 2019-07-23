module.exports = {
	name: '<command name>',
	description: '<command description>',
	args: '<any args if exists>',
	async execute(bot, ctx) {
		const args = ctx.message.text.slice('/'.length).trim().split(/ +/g);
		args.shift().toLowerCase();
	}
};
