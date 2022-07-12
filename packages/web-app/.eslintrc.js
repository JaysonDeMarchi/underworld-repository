module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	parserOptions: {
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': [ 'warn' ],
	},
};
