module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2020': true,
	},
	'extends': [
		'google',
	],
	'parserOptions': {
		'ecmaVersion': 11,
	},
	'rules': {
		'indent': ['error', 'tab'],
		'no-tabs': 0,
		'max-len': 0,
		'object-curly-spacing': 0,
		'require-jsdoc': 0,
		'valid-jsdoc': 0,
		'quotes': 0,
		'arrow-parens': 0,
	},
};
