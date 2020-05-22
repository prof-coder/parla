const Shopify = require('shopify-api-node');
const globby = require('globby');
const utils = require('./utils');
const themekit = require('@shopify/themekit').command;

/**
 * List of files which can't be deleted.
 */
module.exports.forbiddenFiles = () => {
	return [
		'config/settings_data.json',
		'config/settings_schema.json',
		'templates/blog.liquid',
		'templates/cart.liquid',
		'templates/collection.liquid',
		'templates/index.liquid',
		'templates/gift_card.liquid',
		'templates/page.liquid',
		'templates/product.liquid',
		'layout/theme.liquid'
	];
};

/**
 * Check the file in the Forbidden List.
 */
module.exports.isforbiddenFile = file => {
	return exports.forbiddenFiles().indexOf(file) >= 0;
};

/**
 * Get all theme files.
 */

module.exports.getAssetList = (shop, password, theme) => {
	const Shopify = require('shopify-api-node');
	let files = [];

	const shopify = new Shopify({
		shopName: shop,
		accessToken: password
	});

	return shopify.asset
		.list(theme)
		.then(files => files, err => console.error(err))
		.then(files => {
			let filesThemp = [];

			for (var file of files) {
				if (!exports.isforbiddenFile(file.key)) {
					filesThemp.push(file.key);
				}
			}

			return filesThemp;
		});
};

/**
 * Get all shopify theme files from local directory.
 */
module.exports.getLocalFiles = (files = []) => {
	return globby([utils.shopifyPath(), ...files]);
};

/**
 * Shopify ThemeKit.
 */
module.exports.themekit = (
	command = 'watch',
	env = 'development',
	config,
	args = [],
	callback = () => {}
) => {
	themekit(
		{
			args: [command, '--env', env, '--config', config, ...args]
		},
		function(error) {
			if (error) {
				process.exit(1);

				return;
			}

			callback();
		}
	);
};
