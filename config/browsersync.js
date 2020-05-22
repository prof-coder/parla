/**
 * The module dependencies.
 */
const fs = require("fs");
const url = require("url");
const path = require("path");
const argv = require("yargs").argv;
const utils = require("./utils");
const shopify = utils.getShopifyEnv();

/**
 * Prepare the configuration.
 */
const config = {
	host: "localhost",
	port: 3000,
	open: "external",
	https: true,
	files: [utils.buildPath("**/*.css"), utils.buildPath("**/*.js"), utils.buildPath("**/*.html"), utils.basePath("theme_ready")],
	ghostMode: {
		clicks: false,
		scroll: true,
		forms: {
			submit: true,
			inputs: true,
			toggles: true
		}
	},
	snippetOptions: {
		rule: {
			match: /<\/body>/i,
			fn: (snippet, match) => `${snippet}${match}`
		}
	},
	server: {
		baseDir: utils.buildPath(),
		directory: true
	},
	reloadThrottle: 100
};

if (argv.shopify === "true" && Object.keys(shopify).length) {
	config.proxy = {
		target: `https://${shopify.store}?preview_theme_id=${shopify.theme_id}&_fd=0`
	};

	delete config.server;
}

/**
 * Load the proxy configuration from cli arguments.
 */
if (argv.devUrl !== undefined) {
	config.host = url.parse(argv.devUrl).hostname;
	config.proxy = argv.devUrl;

	delete config.server;
}

module.exports = config;
