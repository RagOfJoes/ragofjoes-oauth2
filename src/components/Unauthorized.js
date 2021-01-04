import React from 'react';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Layout from 'components/Layout';

const useStyles = makeStyles(
	(theme) => ({
		unauthorized: {
			display: 'flex',
			height: `calc(100vh - ${theme.spacing(6)}px)`,
			[theme.breakpoints.down('xs')]: {
				height: `calc(100vh - ${40 + theme.spacing(6) + theme.spacing(3)}px)`,
			},
		},
		status: {
			fontWeight: 400,
		},
		name: {
			fontWeight: 500,
		},
	}),
	{ name: 'Unauthorized' }
);

export default (props) => {
	const { message } = props;
	const styles = useStyles();

	return (
		<Layout>
			<Helmet>
				<title>Unauthorized</title>
			</Helmet>
			<Grid
				container
				justify="center"
				direction="column"
				alignItems="center"
				className={styles.unauthorized}>
				<Grid item>
					<Typography variant="h5">
						{message || "You don't have access to this resource."}
					</Typography>
				</Grid>
			</Grid>
		</Layout>
	);
};
