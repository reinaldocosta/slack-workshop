const { App } = require('@slack/bolt')


const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
	// Start your app
	await app.start(process.env.PORT || 3000)

	console.log('⚡️ Bolt app is running!')
})()

// Waiting for the save4later message action to be called, which will retrieve a message link
// and post to the user who initiated's app home
app.shortcut('save4later-xyz', async ({ shortcut, ack, say, respond, context }) => {
	ack()

	try {
		const resultLink = await app.client.chat.getPermalink({
			token: context.botToken,
			channel: shortcut.channel.id,
			message_ts: shortcut.message_ts
		})

		var theMessage = `:wave: Hi there! remember when you thought you'd enjoy this interesting message ${resultLink.permalink}? Thank yourself for this!!`

		// Try block for second web api call to post link to the message
		try {
			await app.client.chat.postMessage({
				// The token you used to initialize your app is stored in the `context` object
				// Sending the channel id as the user will send to the user
				token: context.botToken,
				channel: shortcut.user.id,
				as_user: true,
				text: theMessage
			})
			console.log(`Remember request sent to ${shortcut.user.id}`)
		} catch (postMessageFailure) {
			console.error(postMessageFailure)
		}
	} catch (permaLinkFailure) {
		console.error(permaLinkFailure)
	}
})