import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ClientCard from './card';
import ClientForm from './form';
import Layout from 'components/Layout';
import ErrorCard from 'components/ErrorCard';
import Unauthorized from 'components/Unauthorized';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	(theme) => ({
		container: {
			height: '100%',
		},
		createContainer: {
			justifyContent: 'flex-end',

			[theme.breakpoints.down('sm')]: {
				justifyContent: 'flex-start',
			},
		},
	}),
	{ name: 'ClientPage' }
);

export default () => {
	const styles = useStyles();
	const { user, flash, error } = useInteraction();
	const [loading, updateLoading] = useState(true);
	const [clients, updateClients] = useState({});
	const [clientIds, updateClientIds] = useState([]);
	const [dialog, setDialog] = useState({
		open: false,
		/**
		 * @type {Object|Null} client
		 */
		client: undefined,
	});
	useEffect(async () => {
		if (!user?.isAdmin) return;
		const res = await fetch('/api/client/get-authorized');
		const json = await res.json();
		if (json.ok && json?.data?.clients) {
			const { clients } = json.data;
			const tempClients = {};
			const tempIds = clients.map((client) => client.client_id);
			clients.forEach((client) => (tempClients[client.client_id] = client));
			updateClientIds(tempIds);
			updateClients(tempClients);
			updateLoading(false);
		}
	}, []);

	if (!user) {
		return (
			<Container maxWidth="md">
				<Helmet>
					<title>Unauthorized</title>
				</Helmet>

				<Grid container justify="center" alignItems="center" className={styles.container}>
					<ErrorCard message="You must be logged in to access this page." />
				</Grid>
			</Container>
		);
	}

	const { isAdmin } = user;
	if (!isAdmin) return <Unauthorized />;

	return (
		<Layout>
			<Helmet>
				<title>Client</title>
			</Helmet>
			<Grid container spacing={2} className={styles.container}>
				<Grid item container spacing={2} justify="space-between">
					<Grid item xs={12} md={6}>
						<Typography variant="h6">Client</Typography>
						<Typography variant="body2" color="textSecondary">
							Create, read, update, and delete clients.
						</Typography>
					</Grid>

					<Grid
						item
						md={6}
						xs={12}
						container
						alignItems="flex-start"
						className={styles.createContainer}>
						<Button
							color="primary"
							variant="contained"
							startIcon={<AddRoundedIcon />}
							onClick={() => setDialog({ open: true, client: undefined })}>
							Create New Client
						</Button>
					</Grid>
				</Grid>

				{(flash || error) && (
					<Grid item xs={12}>
						<div className={styles.flash}>
							<Typography variant="subtitle2">
								Error: {flash || error?.message}
							</Typography>
						</div>
					</Grid>
				)}

				{loading &&
					Array.from({ length: 4 }).map((_, i) => (
						<Grid md={4} xs={12} item key={`loading-client-${i}`} container>
							<ClientCard loading />
						</Grid>
					))}

				{!loading &&
					clientIds.map((id) => {
						const { client_id, client_name, subject_type, application_type } = clients[
							id
						];
						return (
							<Grid md={4} xs={12} item container key={client_id}>
								<ClientCard
									id={client_id}
									name={client_name}
									subjectType={subject_type}
									applicationType={application_type}
									onDelete={async () => {
										try {
											const res = await fetch(`/api/client/register/${client_id}`, {
												method: 'DELETE',
											});
											if (res.status === 204) {
												const newIds = clientIds.filter((id) => id !== client_id);
												const newClients = [];
												newIds.forEach((id) => (newClients[id] = clients[id]));
												updateClientIds(newIds);
												updateClients(newClients);
											}
											setDialog({ open: false, client: undefined });
										} catch (e) {}
									}}
									onEdit={() => setDialog({ open: true, client: clients[id] })}
								/>
							</Grid>
						);
					})}

				<ClientForm
					open={dialog.open}
					setDialog={setDialog}
					initialValues={dialog?.client}
					type={!!dialog?.client ? 'edit' : 'create'}
					onSubmitted={(json) => {
						try {
							updateClients((prev) => ({
								...prev,
								[json.client_id]: json,
							}));
							if (!clientIds.includes(json.client_id)) {
								updateClientIds((prev) => prev.concat([json.client_id]));
							}
						} catch (e) {}
					}}
				/>
			</Grid>
		</Layout>
	);
};
