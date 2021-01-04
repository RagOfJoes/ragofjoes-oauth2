import React from 'react';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import ErrorCard from 'components/ErrorCard';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Login from './login';
import Signup from './signup';
import Logout from './logout';
import Consent from './consent';
import SelectAccount from './select-account';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({}) => ({
		container: {
			height: '100vh',
		},
	}),
	{ name: 'Interaction' }
);

export default () => {
	const styles = useStyles();
	const { error, prompt } = useInteraction();
	
	// Render appropriate View
	switch (prompt?.name) {
		case 'login':
			return <Login />;
		case 'sign_up':
			return <Signup />;
		case 'consent':
			return <Consent />;
		case 'logout.success':
			return <Logout />;
		case 'select_account':
			return <SelectAccount />;
	}

	return (
		<Container>
			<Helmet>
				<title>Error</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<ErrorCard message={error?.message} />
			</Grid>
		</Container>
	);
};
