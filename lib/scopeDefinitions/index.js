module.exports = scope => {
	switch (scope) {
		case 'openid':
			return {
				displayName: 'OpenID',
				description: 'To verify your identity',
				claims: []
			};
		case 'profile':
			return {
				displayName: 'Profile',
				description: 'Read and write access to your User profile.',
				claims: [
					{ displayName: 'First Name', description: '' },
					{ displayName: 'Last Name', description: '' }
				]
			};
		case 'email':
			return {
				displayName: 'Email',
				description: 'Read access to your Email',
				claims: [
					{ displayName: 'Email', description: 'Your Email Address' },
					{ displayName: 'Email Verified', description: "Whether you've verified your Email address or not" }
				]
			};
	}
};
