import React from 'react';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ErrorCard from 'components/ErrorCard';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({}) => ({
		container: {
			height: '100vh',
		},
		card: {
			width: '100%',
			maxWidth: 345,
		},
		content: {
			textAlign: 'center',
		},
		message: {
			textTransform: 'capitalize',
		},
	}),
	{ name: 'Error' }
);

export default () => {
	const styles = useStyles();
	const { error } = useInteraction();

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
