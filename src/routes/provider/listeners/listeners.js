import mongoose from 'mongoose';
import { Provider } from 'oidc-provider';
import registrationListener from './registration';
import ClientUsersModel from 'db/models/client-users';

/**
 * Event listeners for OIDC Provider
 * @param {Provider} provider
 */
const listeners = (provider) => {
	registrationListener(provider);
};

export default listeners;
