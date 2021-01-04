import { Express } from 'express';
import { Provider } from 'oidc-provider';
import apiRoutes from './api';
import viewRoutes from './views';
import providerRoutes from './provider';

/**
 * 
 * @param {Express} server 
 * @param {Object} assets 
 * @param {Provider} provider 
 */
const routes = (server, assets, provider) => {
	apiRoutes(server, provider);
	viewRoutes(server, assets, provider);
	providerRoutes(server, assets, provider);
	server.use(provider.callback);
};

export default routes;
