import { interactionPolicy } from 'oidc-provider';
import login from './login';
import signUp from './sign_up';
import selectAccount from './select_account';

// 1. Copies the default policy, already has login and consent prompt policies
const interactions = interactionPolicy.base();
// 2. Override current login interaction
login(interactions);
// 3. Create signup interaction
signUp(interactions);
// 4. Create select account interaction
selectAccount(interactions);

export default interactions;
