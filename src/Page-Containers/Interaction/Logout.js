import React from 'react';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ErrorCard from 'Components/ErrorCard';
import BoostedApe from 'Components/BoostedApe';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInteraction } from 'lib/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ spacing }) => ({
		container: {
			height: '100vh',
		},
		paper: {
			width: '100%',
			maxWidth: 385,
			padding: spacing(3),
		},
	}),
	{ name: 'Logout' }
);

export default ({}) => {
	const styles = useStyles();
	const { error } = useInteraction();

	if (error) {
		return (
			<Container>
				<Helmet>
					<title>Error</title>
				</Helmet>
				<Grid container justify="center" alignItems="center" className={styles.container}>
					<ErrorCard message={error.message} />
				</Grid>
			</Container>
		);
	}

	return (
		<Container>
			<Helmet>
				<title>Log Out</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<Paper elevation={2} className={styles.paper}>
					<Grid item container spacing={2} direction="column" alignItems="center">
						<Grid item>
							<BoostedApe width={100} animated moisture />
						</Grid>

						<Grid item>
							<Typography variant="h6">Signed out successfully!</Typography>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Container>
	);
};
