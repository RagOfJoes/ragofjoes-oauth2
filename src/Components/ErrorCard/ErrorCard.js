import React, { memo } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ErrorOutlineTwoToneIcon from '@material-ui/icons/ErrorOutlineTwoTone';

const useStyles = makeStyles(
	({}) => ({
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

export default memo(({ message }) => {
	const styles = useStyles();

	return (
		<Card elevation={3} className={styles.card}>
			<CardContent className={styles.content}>
				<ErrorOutlineTwoToneIcon fontSize="large" color="primary" />

				<Typography variant="h6">Oh no...</Typography>

				<Typography variant="body1" color="primary" gutterBottom>
					An error has occured!
				</Typography>

				<Typography variant="subtitle2" className={styles.message}>
					{message || 'Internal Server Error. Please try again later!'}
				</Typography>
			</CardContent>
		</Card>
	);
});
