import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import oidcConfig from 'lib/config';
import views from 'src/routes/views';
import MongoAdapter from 'lib/adapter';
import { Provider } from 'oidc-provider';
import cookieParser from 'cookie-parser';
import setupProvider from 'lib/setupProvider';

const server = express();
(async () => {
	let client;
	const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

	try {
		client = await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		mongoose.Promise = global.Promise;
		console.log('MongoDB Successfully Connected');
	} catch (e) {
		console.log('MongoDB Failed to Connect!', e);
	}

	// Setup express
	server.disable('x-powered-by').use(helmet()).use(cookieParser()).use(express.static(process.env.RAZZLE_PUBLIC_DIR));

	const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

	const provider = new Provider(ISSUER, { adapter: MongoAdapter(client.connection.db), ...oidcConfig });

	// View Routes
	views(server, assets, provider);

	// OIDC Routes
	setupProvider(server, assets, provider);
})().catch((e) => {
	process.exitCode = 1;
});

export default server;
