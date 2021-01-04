import React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PersonIcon from '@material-ui/icons/Person';

const scopeDefinitions = (scope) => {
	switch (scope) {
		case 'openid':
			return {
				Icon: <VpnKeyIcon />,
				displayName: 'OpenID',
				description: 'To verify your identity.',
				claims: [],
			};
		case 'profile':
			return {
				Icon: <PersonIcon />,
				displayName: 'Profile',
				description: 'Read access to your User Profile.',
				claims: [
					{ displayName: 'First Name', description: 'Read access to your First Name.' },
					{ displayName: 'Last Name', description: 'Read access to your Last Name.' },
				],
			};
		case 'email':
			return {
				Icon: <EmailIcon />,
				displayName: 'Email',
				description: 'View your Email address.',
				claims: [
					{ displayName: 'Email', description: 'View your Email address.' },
					{
						displayName: 'Email Verified',
						description:
							"Check whether you've verified your Email address or not.(Still a W.I.P)",
					},
				],
			};
	}
};

export default scopeDefinitions;
