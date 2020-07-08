import { interactionPolicy } from 'oidc-provider';

import login from './login';
import signUp from './sign_up';
import selectAccount from './select_account';

// Copies the default policy, already has login and consent prompt policies
const interactions = interactionPolicy.base();

// Custom Interactions
login(interactions);
signUp(interactions);
selectAccount(interactions);

export default interactions;
