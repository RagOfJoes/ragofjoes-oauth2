import React, { createContext, useState, useMemo, useContext } from 'react';

// "\u003Cform id=\"op.logoutForm\" method=\"post\" action=\"http:\u002F\u002Flocalhost:8082\u002Fsession\u002Fend\u002Fconfirm\"\u003E\u003Cinput type=\"hidden\" name=\"xsrf\" value=\"569341cc6f154f83e99fc98dbc3074bd0fdae3aa31a45743\"\u002F\u003E\u003C\u002Fform\u003E"}}}
const InteractionContext = createContext({
	uid: '',
	flash: '',

	prompt: {
		name: '',
		details: {
			claims: {
				new: [],
				accepted: [],
				rejected: [],
			},
			scopes: {
				accepted: [],
				rejected: [],
			},
			login_hint: '',
			logout_form: {
				xsrf: '',
				action: '',
			},
		},
	},

	error: {
		name: '',
		message: '',
	},
	setError: () => {},

	client: {
		tosUri: '',
		clientId: '',
		policyUri: '',
		clientName: '',
	},

	user: {
		name: {
			full: '',
			last: '',
			first: '',
		},
		email: '',
	},
	setUser: () => {},
});

/**
 * @param {Object} props
 *
 * @param {String} props.uid
 *
 * @param {Object} props.user
 * @param {String} props.user.email
 * @param {String} props.user.phone
 * @param {Object} props.user.name
 * @param {String} props.user.name.full
 * @param {String} props.user.name.last
 * @param {String} props.user.name.first
 *
 * @param {String} props.flash
 *
 * @param {Object} props.prompt
 * @param {String} props.prompt.name
 * @param {Object} props.prompt.details
 * @param {String} props.prompt.details.login_hint
 * @param {Object} props.prompt.details.logout_form
 * @param {String} props.prompt.details.logout_form.xsrf
 * @param {String} props.prompt.details.logout_form.action
 * @param {Object} props.prompt.details.claims
 * @param {Array<String>} props.prompt.details.claims.new
 * @param {Array<String>} props.prompt.details.claims.accepted
 * @param {Array<String>} props.prompt.details.claims.rejected
 * @param {Object} props.prompt.details.scopes
 * @param {Array<String>} props.prompt.details.scopes.accepted
 * @param {Array<String>} props.prompt.details.scopes.rejected
 *
 * @param {Object} props.client
 * @param {String} props.client.tosUri
 * @param {String} props.client.clientId
 * @param {String} props.client.policyUri
 * @param {String} props.client.clientName
 *
 * @param {Object} props.error
 * @param {String} props.error.name
 * @param {String} props.error.message

 */
export default ({ children, uid, user, flash, prompt, client, error }) => {
	const [_user, setUser] = useState(user);
	const [_error, setError] = useState(error);

	const value = useMemo(
		() => ({
			uid,
			flash,

			prompt,
			client,

			user: _user,
			setUser,

			error: _error,
			setError,
		}),
		[_user, _error]
	);

	return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
};

export const useInteraction = () => useContext(InteractionContext);
