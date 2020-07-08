import React from 'react';
import Grid from '@material-ui/core/Grid';
import ErrorCard from 'Components/ErrorCard';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInteraction } from 'lib/Providers/InteractionProvider';

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
	{ name: 'Redirect' }
);

export default () => {
	const styles = useStyles();
	const { error } = useInteraction();

	if (error) {
		return (
			<Container>
				<Grid container justify="center" alignItems="center" className={styles.container}>
					<ErrorCard message={error.message} />
				</Grid>
			</Container>
		);
	}

	return (
		<Container>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<Grid item>
					<Typography variant="h6">Redirecting...</Typography>
				</Grid>
			</Grid>
		</Container>
	);
};
