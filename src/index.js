import http from 'http';
import express from 'express';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

if (module.hot) {
	console.log('✅  Server-side HMR Enabled!');

	module.hot.accept('./server', () => {
		console.log('🔁  HMR Reloading `./server`...');

		try {
			app = require('./server').default;
			server.removeListener('request', currentApp);
			server.on('request', app);
			currentApp = app;
		} catch (error) {
			console.error(error);
		}
	});
}

export default express()
	.use((req, res) => app.handle(req, res))
	.listen(process.env.PORT || 5000, function (err) {
		if (err) {
			console.error(err);
			return;
		}
		console.log('🚀 started on Port: ' + process.env.PORT || 5000);
	});
