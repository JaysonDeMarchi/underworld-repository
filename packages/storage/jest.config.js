const config = async () => ({
	setupFilesAfterEnv: [
		'<rootDir>/setup-jest.js',
	],
});

module.exports = config;
