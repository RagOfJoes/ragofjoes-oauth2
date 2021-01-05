'use strict';
const path = require('path');
const razzleHeroku = require('razzle-heroku');

module.exports = {
	modifyWebpackConfig: (opts) => {
		const dev = opts.env.dev;
		const target = opts.env.target;
		let config = opts.webpackConfig;
		const webpack = opts.webpackObject;

		config = razzleHeroku(config, { target, dev }, webpack);
		config.resolve.alias = {
			src: path.resolve(__dirname, 'src'),
			db: path.resolve(__dirname, 'src/db/'),
			lib: path.resolve(__dirname, 'src/lib/'),
			pages: path.resolve(__dirname, 'src/pages/'),
			routes: path.resolve(__dirname, 'src/routes/'),
			provider: path.resolve(__dirname, 'src/provider/'),
			components: path.resolve(__dirname, 'src/components/'),
			'page-containers': path.resolve(__dirname, 'src/page-containers/'),
		};

		return config;
	},
};
