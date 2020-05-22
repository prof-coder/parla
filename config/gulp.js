/**
 * The module dependencies.
 */
const del = require("del");
const path = require("path");
const gulp = require("gulp");
const sass = require("gulp-sass");
const utils = require("./utils");
const gulpif = require("gulp-if");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const plumber = require("gulp-plumber");
const webpack = require("webpack-stream");
const bundler = require("webpack");
const posthtml = require("gulp-posthtml");
const imagemin = require("gulp-imagemin");
const settings = require("./settings");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync");
const shopify = require("./shopify");
const argv = require("yargs").argv;
const gulpwatch = require('gulp-watch');

/**
 * Setup the env.
 */
const { isProd, isDev, isBuild } = utils.detectEnv();

/**
 * Shopify Config
 */

const isShopify = argv.shopify === "true";
const shopifyEnv = utils.getEnv();
const shopifyConfig = utils.shopifyConfig();
const shopifyNotify = utils.shopifyNotify();

/**
 * Show notification on error.
 */
const error = function(e) {
	notify.onError({
		title: "Gulp",
		message: e.message,
		sound: "Beep"
	})(e);

	this.emit("end");
};

const postcssShopify = () => {
	const plugins = [];
	const pathToRemove = "../../../shopify/assets/";
	const pathToAdd = "./";

	plugins.push(
		require("postcss-url")({
			url: (asset, dir) => {
				if (asset.absolutePath === utils.buildStylesPath("../temp/bundle.css")) {
					return;
				}

				return utils.copyAsset(asset, dir, utils.shopifyAssetsPath, url => {
					return url.replace(pathToRemove, pathToAdd).replace(/[\.\/]+(.+?)(\??#.+)?$/g, "{{ '$1' | asset_url }}$2");
				});
			}
		})
	);

	return { plugins };
};

/**
 * Process Sass files through Sass and PostCSS.
 */

const styleHtml = () => {
	const config = require("./postcss");
	const src = utils.srcStylesPath("main.scss");
	const dest = utils.buildStylesPath();

	return gulp
		.src(src)
		.pipe(gulpif(isDev || isBuild, sourcemaps.init()))
		.pipe(
			sass({
				includePaths: [".", utils.srcVendorPath(), path.resolve(__dirname, "../node_modules")]
			}).on("error", error)
		)
		.pipe(plumber({ errorHandler: error }))
		.pipe(postcss(config))
		.pipe(rename("bundle.css"))
		.pipe(gulpif(isDev || isBuild, sourcemaps.write("./")))
		.pipe(gulp.dest(dest));
};

const styleShopify = () => {
	const config = require("./postcss");
	const src = utils.srcStylesPath("main.scss");
	const build = utils.buildStylesPath("../temp");
	const dest = utils.shopifyAssetsPath();

	return (
		gulp
			.src(src)
			.pipe(gulpif(isDev || isBuild, sourcemaps.init()))
			.pipe(
				sass({
					includePaths: [".", utils.srcVendorPath(), path.resolve(__dirname, "../node_modules")]
				}).on("error", error)
			)
			//.pipe(rename('bundle-temp.css'))
			.pipe(plumber({ errorHandler: error }))
			.pipe(postcss(config))
			.pipe(rename("bundle.css"))
			.pipe(gulp.dest(build))
			.pipe(postcss(postcssShopify))
			.pipe(
				gulpif(
					isDev || isBuild,
					sourcemaps.write(dest, {
						includeContent: false,
						sourceMappingURL: file => '{{ "bundle.css.map" | asset_url }}'
					})
				)
			)
			.pipe(gulp.dest(build))
			.pipe(rename("bundle.css.liquid"))
			.pipe(gulp.dest(dest))
	);
};

const styles = () => {
	if (isShopify) {
		return styleShopify();
	}

	return styleHtml();
};

/**
 * Process JS files through Webpack.
 */
const scripts = () => {
	const src = utils.srcScriptsPath("main.js");
	const dest = utils.buildScriptsPath();
	const config = require("./webpack");

	return gulp
		.src(src)
		.pipe(plumber({ errorHandler: error }))
		.pipe(webpack(config, bundler))
		.pipe(gulp.dest(dest))
		.pipe(gulp.dest(utils.shopifyAssetsPath()));
};

/**
 * Process HTML files through PostHTML.
 */
const pages = () => {
	const src = [utils.srcPath("**/*.html"), `!${utils.srcPath("partials/*.html")}`, `!${utils.srcPath("assets/*.html")}`];
	const dest = utils.buildPath();
	const config = require("./posthtml");

	return gulp.src(src).pipe(plumber({ errorHandler: error })).pipe(posthtml(config)).pipe(gulp.dest(dest));
};

/**
 * Copy files to build path.
 */
const copy = () => {
	const src = [
		utils.srcPath("**"),
		`!${utils.srcPath("**/*.html")}`,
		`!${utils.srcPath("partials/")}`,
		`!${utils.srcPath("partials/**")}`,
		`!${utils.srcPath("assets/{css,scss,fonts,images,js}/")}`,
		`!${utils.srcPath("assets/{css,scss,fonts,images,js}/**")}`,
		`!${utils.srcPath("assets/**/*.html")}`
	];
	const dest = utils.buildPath();

	return gulp.src(src).pipe(plumber({ errorHandler: error })).pipe(gulp.dest(dest));
};

const vendor = () => {
	const src = utils.srcVendorPath("**/*");
	const dest = utils.buildVendorPath();

	return gulp.src(src).pipe(plumber({ errorHandler: error })).pipe(gulp.dest(dest)).pipe(gulp.dest(utils.shopifyAssetsPath()));
};

/**
 * Copy all images used in HTML files.
 */
const images = () => {
	const src = [utils.srcImagesPath("**/*"), `!${utils.srcImagesPath("sprite*")}`, `!${utils.srcImagesPath("sprite/*")}`];
	const dest = utils.buildImagesPath();

	return gulp.src(src).pipe(plumber({ errorHandler: error })).pipe(gulp.dest(dest));
};

/**
 * Optimize all images in the build folder.
 */
const optimize = () => {
	const src = utils.buildImagesPath("**/*");
	const dest = utils.buildImagesPath();

	return gulp.src(src).pipe(plumber({ errorHandler: error })).pipe(imagemin(settings.imageminSettings)).pipe(gulp.dest(dest));
};

/**
 * Compile a single html page
 */
const page = (file, folder) => {
	const dest = utils.buildPath(folder);
	const config = require("./posthtml");

	return gulp.src(file).pipe(plumber({ errorHandler: error })).pipe(posthtml(config)).pipe(gulp.dest(dest));
};

/**
 * Watch for changes and run through different tasks.
 */
const watch = () => {
	gulpwatch(utils.srcStylesPath("**/*.scss"), styles);
	// gulp.watch([utils.srcStylesPath("**/*.scss"), utils.srcImagesPath("sprite/*.png")], styles);

	gulp.watch([utils.srcPath("partials/*")], pages);

	gulp.watch([utils.srcPath("ajax/*")]).on("change", file => {
		page(file, "ajax/");
	});

	gulp.watch([utils.srcPath("**/*.html"), `!${utils.srcPath("partials/*")}`, `!${utils.srcPath("ajax/*")}`]).on("change", file => {
		page(file, "");
	});

	gulp.watch(
		[
			utils.srcPath("**"),
			`!${utils.srcPath("**/*.html")}`,
			`!${utils.srcPath("partials/")}`,
			`!${utils.srcPath("partials/**")}`,
			`!${utils.srcPath("assets/{css,fonts,images,js}/")}`,
			`!${utils.srcPath("assets/{css,fonts,images,js}/**")}`,
			`!${utils.srcPath("assets/**/*.html")}`
		],
		copy
	);

	gulp.watch([utils.srcVendorPath("**/*")], vendor);

	gulp.watch([utils.srcImagesPath("**/*")], images);
};

/**
 * Refresh the browser when a file is changed.
 */
const reload = () => {
	const config = require("./browsersync");

	browserSync(config);
};

/**
 * Remove the build.
 */
const clean = () => {
	return del([utils.buildPath()], { force: true });
};

/**
 *
 * Shopify Functions
 *
 */

/**
 * Shopify watcher.
 */

const shopifyWatch = done => {
	shopify.themekit("watch", shopifyEnv, shopifyConfig, ["--notify", shopifyNotify], () => {
		done();
	});

	setTimeout(() => {
		done();
	}, 1000);
};

/**
 * Remove all files from Shopify server.
 */
const shopifyPurge = done => {
	const enviroments = utils.getShopifyEnvList();
	const env = enviroments[shopifyEnv];

	if (!env) {
		console.error(`Error: ${shopifyEnv} does not exist in this environments list`);

		return;
	}

	const filesList = shopify.getAssetList(env.store, env.password, env.theme_id);

	filesList.then(files => {
		if (!files.length) {
			return done();
		}

		shopify.themekit("remove", shopifyEnv, shopifyConfig, files, () => {
			done();
		});
	});
};

/**
 * Upload all local theme files to Shopify server.
 */
const shopifyUpload = done => {
	shopify.getLocalFiles(settings.shopify.upload.ignore || []).then(files => {
		files = files.map(file => path.relative(utils.shopifyPath(), file));

		shopify.themekit("upload", shopifyEnv, shopifyConfig, files, () => {
			done();
		});
	});
};

/**
 * Delete all shopify assets in the local Shopify theme directory.
 */
const shopifyRemoveAssets = () => {
	return del([utils.shopifyPath("assets/*")], { force: true });
};

/**
 * Register the tasks.
 */
let devProcesses = gulp.series(clean, gulp.parallel(styleHtml, scripts, pages, copy, vendor, images, watch, reload));

if (argv.shopify === "true") {
	devProcesses = gulp.series(clean, shopifyWatch, gulp.parallel(styleShopify, scripts, pages, copy, vendor, images, watch, reload));
}

gulp.task("dev", devProcesses);
gulp.task("build", gulp.series(clean, styleHtml, scripts, pages, copy, vendor, images, optimize));

/**
 * Register shopify tasks.
 */

gulp.task("buildShopify", gulp.series(clean, styleShopify, scripts, pages, copy, vendor, images, optimize));
gulp.task("shopifyPurge", shopifyPurge);

gulp.task("shopifyDeploy", gulp.series(shopifyRemoveAssets, "buildShopify", shopifyUpload));

gulp.task("purge", gulp.series("shopifyPurge"));

gulp.task("deploy", gulp.series("shopifyDeploy"));

/**
 * Register default gulp task.
 */
gulp.task("default", gulp.series("dev"));
