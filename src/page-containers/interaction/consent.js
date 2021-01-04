import Helmet from 'react-helmet';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ErrorCard from 'components/ErrorCard';
import BoostedApe from 'components/BoostedApe';
import scopeDefinitions from 'provider/scope-definitions';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ palette, spacing }) => ({
		container: {
			height: '100vh',
		},
		paper: {
			width: '100%',
			maxWidth: 385,
			padding: spacing(3),
			marginTop: spacing(2),
			marginBottom: spacing(2),
		},
		icon: {
			color: palette.text.primary,
		},
		expand: {
			marginLeft: spacing(2),
		},
		nested: {
			paddingLeft: spacing(3),
		},
		divider: {
			backgroundColor: fade(palette.text.primary, 0.3),
		},
	}),
	{ name: 'ConsentInteraction' }
);

export default () => {
	const styles = useStyles();
	const {
		uid,
		client,
		prompt: {
			details: { scopes, claims },
		},
	} = useInteraction();

	if (
		[scopes.accepted, scopes.rejected, claims.accepted, claims.rejected].every(
			({ length }) => length === 0
		)
	) {
		const nScopes = new Set(scopes.new);
		nScopes.delete('offline_access');
		return (
			<Container>
				<Helmet>
					<title>Consent</title>
				</Helmet>
				<Grid container justify="center" alignItems="center" className={styles.container}>
					<Paper className={styles.paper}>
						<Grid container spacing={2} direction="column">
							<Grid item container justify="center">
								<BoostedApe width={100} animated moisture />
							</Grid>

							<Grid item container justify="center">
								<Typography variant="h6" align="center" component="span">
									Allow{' '}
									<Typography
										variant="h6"
										align="center"
										color="primary"
										component="strong">
										{client.clientName}{' '}
									</Typography>
									access to:
								</Typography>
							</Grid>

							<Grid item>
								{nScopes.size && (
									<List>
										{[...nScopes].map((scope, index) => {
											const _scope = scopeDefinitions(scope);
											const [open, toggleOpen] = useState(false);
											const { Icon, claims, displayName, description } = _scope;
											return (
												<React.Fragment key={`${scope}-${index}`}>
													<ListItem button centerRipple onClick={() => toggleOpen(!open)}>
														<ListItemIcon className={styles.icon}>{Icon}</ListItemIcon>
														<ListItemText primary={displayName} secondary={description} />
														{claims?.length > 0 ? (
															open ? (
																<ExpandLess className={styles.expand} />
															) : (
																<ExpandMore className={styles.expand} />
															)
														) : null}
													</ListItem>
													<Collapse in={open} timeout="auto">
														<List component="div" disablePadding>
															{claims.map((claim, index) => {
																return (
																	<React.Fragment key={`${claim.displayName}-${index}`}>
																		<ListItem button className={styles.nested}>
																			<ListItemText
																				primary={claim.displayName}
																				secondary={claim.description}
																			/>
																		</ListItem>
																	</React.Fragment>
																);
															})}
														</List>
													</Collapse>
												</React.Fragment>
											);
										})}
									</List>
								)}
							</Grid>
						</Grid>

						<Grid item container spacing={1} direction="column" alignItems="center">
							<Grid item style={{ width: '100%' }}>
								<form
									method="post"
									autoComplete="off"
									action={`/interaction/${uid}/confirm`}>
									<Button fullWidth type="submit" color="primary" variant="contained">
										Confirm
									</Button>
								</form>
							</Grid>

							<Grid item>
								<form
									method="post"
									autoComplete="off"
									action={`/interaction/${uid}/abort`}>
									<Button type="submit">Cancel</Button>
								</form>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Container>
		);
	}

	return (
		<Container>
			<Helmet>
				<title>Error</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<ErrorCard message="Internal Server Error!" />
			</Grid>
		</Container>
	);
};
