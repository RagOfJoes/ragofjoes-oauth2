import Helmet from 'react-helmet';
import React, { useRef } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { lighten } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ForwardIcon from '@material-ui/icons/ArrowForwardIosRounded';
import BoostedApe from 'components/BoostedApe';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ shape, spacing, palette, transitions }) => ({
		container: {
			height: '100vh',
		},
		paper: {
			width: '100%',
			maxWidth: 385,
			padding: spacing(3),
		},
		card: {
			width: '100%',
			cursor: 'pointer',
			padding: spacing(2),
			borderRadius: shape.borderRadius,
			transition: transitions.create(),
			backgroundColor: palette.background.default,

			'&:hover': {
				backgroundColor: lighten(palette.background.default, 0.05),
			},
		},
		cardValue: {
			color: palette.text.primary,
		},
	}),
	{ name: 'SelectAccountInteraction' }
);

export default () => {
	const styles = useStyles();
	const {
		uid,
		client,
		user: {
			name: { full },
			email,
		},
	} = useInteraction();

	const switchForm = useRef(null);
	const continueForm = useRef(null);

	return (
		<Container>
			<Helmet>
				<title>Select Account</title>
			</Helmet>
			<Grid
				container
				justify="center"
				alignItems="center"
				direction="column"
				className={styles.container}>
				<Paper elevation={2} className={styles.paper}>
					<Grid item container spacing={2} direction="column" alignItems="center">
						<Grid item container justify="center">
							<BoostedApe width={100} animated moisture />
						</Grid>

						<Grid item>
							<Typography variant="h6" align="center" component="span">
								Select Account for{' '}
								<Typography
									variant="h6"
									align="center"
									color="primary"
									component="strong">
									{client.clientName}
								</Typography>
							</Typography>{' '}
						</Grid>

						<Grid item style={{ width: '100%' }}>
							<form
								method="POST"
								ref={continueForm}
								autoComplete="off"
								action={`/interaction/${uid}/continue`}
								style={{ width: '100%' }}>
								<ButtonBase style={{ width: '100%', borderRadius: 4 }}>
									<Card
										elevation={2}
										className={styles.card}
										onClick={() => continueForm.current.submit()}>
										<Grid
											container
											spacing={2}
											wrap="nowrap"
											justify="space-between"
											alignItems="center">
											<Grid item>
												<Typography
													align="left"
													gutterBottom
													variant="subtitle2"
													color="textSecondary">
													Continue as
												</Typography>
												<Typography align="left" variant="body1" color="textPrimary">
													{full}{' '}
													<Typography
														align="left"
														variant="subtitle2"
														component="strong"
														color="primary">
														{email}
													</Typography>
												</Typography>
											</Grid>

											<Grid item>
												<ForwardIcon fontSize="small" className={styles.cardValue} />
											</Grid>
										</Grid>
									</Card>
								</ButtonBase>
							</form>
						</Grid>

						<Grid item>
							<form
								ref={switchForm}
								method="POST"
								autoComplete="off"
								action={`/interaction/${uid}/continue`}>
								<input type="hidden" name="switch" value="true" />
								<Button fullWidth onClick={() => switchForm.current.submit()}>
									Switch Account
								</Button>
							</form>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</Container>
	);
};
