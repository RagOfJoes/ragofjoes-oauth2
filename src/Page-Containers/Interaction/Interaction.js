import React from 'react';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Consent from './Consent';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import SelectAccount from './SelectAccount';
import ErrorCard from 'Components/ErrorCard';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInteraction } from 'lib/Providers/InteractionProvider';

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
