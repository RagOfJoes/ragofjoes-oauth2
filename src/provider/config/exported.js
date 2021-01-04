export const scopes = [
	{ label: 'OpenID', value: 'openid' },
	{ label: 'Profile', value: 'profile' },
	{ label: 'E-mail', value: 'email' },
	{ label: 'Offline Access', value: 'offline_access' },
];

export const responseTypes = [
	{ label: 'None', value: 'none' },
	{ label: 'Code', value: 'code' },
	{ label: 'Id Token', value: 'id_token' },
	{ label: 'Code and Id Token', value: 'code id_token' },
];

export const subjectTypes = [{ label: 'Public', value: 'public' }];

export const applicationTypes = [
	{ label: 'Web', value: 'web' },
	{ label: 'Native', value: 'native' },
];
