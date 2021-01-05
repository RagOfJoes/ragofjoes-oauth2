// import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import setupRoutes from 'routes';
import setupProvider from 'provider/setup';

const server = express();
const main = async () => {
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
		console.error('MongoDB Failed to Connect!', e);
	}

	server
		.disable('x-powered-by')
		// .use(helmet())
		.use(cookieParser())
		.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
		.use(
			morgan('(:date[web]) :method :url :status :res[content-length] - :response-time ms')
		);

	const provider = setupProvider(server, client);
	// Routes
	setupRoutes(server, assets, provider);
};

main().catch((e) => {
	console.error(e);
	process.exitCode = 1;
});

export default server;
