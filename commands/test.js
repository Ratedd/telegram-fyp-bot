const fetch = require('node-fetch');

module.exports = {
	name: 'test',
	description: 'For testing purposes',
	args: false,
	async execute(bot, ctx) { // eslint-disable-line no-unused-vars
		const data = await fetch('https://api.telegram.org/bot784702199:AAGVh6-L9oQXraAZJTvmn-yhH8qUD384ZH8/sendMessage?chat_id=643577681&text=test%20test', { method: 'POST' }).then(res => res.text());
		bot.log.info(data);
	}
};
