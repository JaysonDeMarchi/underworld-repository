import { roboto } from '@theme-ui/presets';

const theme = {
	...roboto,
	colors: {
		discordBlue: '#5865F2',
		twitchPurple: '#9146FF',
	},
	fonts: {
		...roboto.fonts,
		body: `LinBiolinumO, ${roboto.fonts.body}`,
		heading: `LinBiolinumO, ${roboto.fonts.heading}`,
	},
	buttons: {
		discord: {
			color: 'white',
			bg: 'discordBlue',
		},
		twitch: {
			color: 'white',
			bg: 'twitchPurple',
		},
	},
};

export default theme;
