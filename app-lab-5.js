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

// Custom unfurls
app.event('link_shared', async ({ event, context }) => {
	console.log('got a link share event')
	const unfurls = {}
	event.links.forEach(async (link) => {
		// let customText = `:wave: This is a custom unfurl of *url*=${link.url} *domain*=${link.domain}`;
		const unfurlBlocks = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: 'This is a custom unfurl, made possible by calling the Slack `chat.unfurl` API'
				}
			},
			{
				type: 'divider'
			},
			{
				type: 'section',
				fields: [
					{
						type: 'mrkdwn',
						text: `*Domain:*\n${link.domain}`
					},
					{
						type: 'mrkdwn',
						text: `*URL:*\n${link.url}`
					}
				]
			},
			{
				type: 'divider'
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: 'Was this unfurl helpful?'
				}
			},
			{
				type: 'actions',
				elements: [
					{
						type: 'button',
						text: {
							type: 'plain_text',
							emoji: true,
							text: 'Yes :100: '
						},
						style: 'primary',
						value: 'yes_helpful'
					},
					{
						type: 'button',
						text: {
							type: 'plain_text',
							emoji: true,
							text: 'Needs work :thumbsdown:'
						},
						style: 'danger',
						value: 'no_needs_work'
					}
				]
			}
		]
		unfurls[link.url] = { blocks: unfurlBlocks }
	})
	app.client.chat.unfurl({
		token: process.env.SLACK_BOT_TOKEN,
		channel: event.channel,
		ts: event.message_ts,
		unfurls: unfurls
	})
})