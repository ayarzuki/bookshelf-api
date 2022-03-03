/* Submissiob by: Aulya Yarzuki K. */

// Import Dependencies
import Hapi from '@hapi/hapi';
import routes from './routes.js';

const init = async () => {
	const server = Hapi.server({
		port: 5000,
		host: 'localhost',
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	server.route(routes);

	await server.start();

	// Check server running
	console.log(`Server running on ${server.info.uri}`);
};

init();
