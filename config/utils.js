/**
 * The module dependencies.
 */
const fs = require("fs-extra");
const path = require("path");
const argv = require("yargs").argv;
const slash = require("slash");
const yaml = require("js-yaml");

// Base path
module.exports.basePath = (basePath = "", destPath = "") => path.resolve(__dirname, "../", basePath, destPath);

// Base `src` path
module.exports.srcPath = (basePath = "", destPath = "") => path.resolve(__dirname, "../markup", basePath, destPath);

// Base `build` path
module.exports.buildPath = (basePath = "", destPath = "") => path.resolve(__dirname, "../build", basePath, destPath);

// Base `shopify` path
module.exports.shopifyPath = (basePath = "", destPath = "") => path.resolve(__dirname, "../shopify", basePath, destPath);

// Base `src` path for scripts
module.exports.srcScriptsPath = destPath => exports.basePath("assets/js", destPath);

// Base `src` path for stylesheets
module.exports.srcStylesPath = destPath => exports.basePath("assets/scss", destPath);

// Base `src` path for images
module.exports.srcImagesPath = destPath => exports.basePath("assets/images", destPath);

// Base `src` path for fonts
module.exports.srcFontsPath = destPath => exports.basePath("assets/fonts", destPath);

// Base `src` path for vendor files
module.exports.srcVendorPath = destPath => exports.basePath("assets/vendor", destPath);

// Base `build` path for scripts
module.exports.buildScriptsPath = destPath => exports.buildPath("assets/js", destPath);

// Base `build` path for stylesheets
module.exports.buildStylesPath = destPath => exports.buildPath("assets/css", destPath);

// Base `build` path for images
module.exports.buildImagesPath = destPath => exports.buildPath("assets/images", destPath);

// Base `build` path for fonts
module.exports.buildFontsPath = destPath => exports.buildPath("assets/fonts", destPath);

// Base `build` path for vendor files
module.exports.buildVendorPath = destPath => exports.buildPath("assets/vendor", destPath);

// Base `shopify` path for assets
module.exports.shopifyAssetsPath = destPath => exports.shopifyPath("assets", destPath);

// Detect invironment type
module.exports.detectEnv = () => {
	const env = process.env.NODE_ENV || "development";
	const isDev = env === "development";
	const isProd = env === "production";
	const isBuild = env === "build";

	return {
		env,
		isDev,
		isProd,
		isBuild
	};
};

// Get Shopify invironment type
module.exports.getEnv = () => {
	const env = argv.env || "development";

	return env;
};

// Get Shopify Config
module.exports.shopifyConfig = () => {
	return path.resolve(exports.basePath("config.yml"));
};

// Get Shopify Enviroments
module.exports.getShopifyEnvList = () => {
	return (shopifySettings = fs.existsSync(exports.shopifyConfig()) ? yaml.safeLoad(fs.readFileSync(exports.shopifyConfig(), "utf8")) : {});
};

// Get Shopify current enviroment
module.exports.getShopifyEnv = () => {
	return exports.getShopifyEnvList()[exports.getEnv()] || {};
};

// Get Notify File
module.exports.shopifyNotify = () => {
	return path.resolve(exports.basePath("theme_ready"));
};

module.exports.copyAsset = ({ absolutePath, hash, search }, dir, resolve, modifier) => {
	const to = exports.buildStylesPath();
	const filename = path.basename(absolutePath);
	const destPath = resolve(filename);
	const destPathExists = fs.existsSync(destPath);
	const hasModifier = typeof modifier === "function";
	const newPath = slash(path.relative(to, `${destPath}${search}${hash}`));

	let shouldCopy = true;

	if (destPathExists) {
		const mtimeSource = Math.floor(fs.statSync(absolutePath).mtime.getTime() / 1000);
		const mtimeDest = Math.floor(fs.statSync(destPath).mtime.getTime() / 1000);

		shouldCopy = mtimeSource !== mtimeDest;
	}

	if (shouldCopy) {
		const stat = fs.statSync(absolutePath);

		fs.copySync(absolutePath, destPath);
		fs.utimesSync(destPath, stat.atime, stat.mtime);
	}

	return hasModifier ? modifier(newPath) : newPath;
};
