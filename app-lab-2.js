const { App } = require('@slack/bolt')

// Initializes your app with your bot token and signing secret
const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000)

	console.log('⚡️Hello World.. Bolt app is running!')
})()

// Listens to incoming messages that contain "hello"
app.message('hello', ({ message, say }) => {
	// say() sends a message to the channel where the event was triggered
	say(`Hey there <@${message.user}>! You're done with lab two!`)
})