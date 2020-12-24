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
			lib: path.resolve(__dirname, 'src/lib/'),
			Pages: path.resolve(__dirname, 'src/Pages/'),
			Components: path.resolve(__dirname, 'src/Components/'),
			'Page-Containers': path.resolve(__dirname, 'src/Page-Containers/'),
		};

		return config;
	},
};
