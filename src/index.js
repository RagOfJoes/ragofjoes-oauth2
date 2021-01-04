import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

server
	.listen(process.env.PORT || 5000, () => {
		console.log('🚀 started on Port: ' + process.env.PORT || 5000);
	})
	.on('error', (error) => {
		console.error(error);
	});

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
