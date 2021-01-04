import React from 'react';
import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SecurityForm from './form';
import Layout from 'components/Layout';
import ErrorCard from 'components/ErrorCard';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({}) => ({
		container: {
			height: '100%',
		},
		form: {
			width: '100%',
		},
	}),
	{ name: 'SecurityPage' }
);

export default () => {
	const styles = useStyles();
	const history = useHistory();

	const { user, setError } = useInteraction();

	if (!user) {
		return (
			<Container maxWidth="md">
				<Helmet>
					<title>Unauthorized</title>
				</Helmet>

				<Grid container justify="center" alignItems="center" className={styles.container}>
					<ErrorCard message="You must be logged in to access this page!" />
				</Grid>
			</Container>
		);
	}

	return (
		<Layout>
			<Helmet>
				<title>Profile</title>
			</Helmet>
			<Grid container direction="column" className={styles.container}>
				<Formik
					enableReinitialize
					initialValues={{
						'new-password': '',
						'confirm-password': '',
						'current-password': '',
					}}
					onSubmit={async (values, actions) => {
						// 1. Set appropriate state
						setError(null);
						actions.setSubmitting(true);
						const changedPassword =
							values['current-password']?.length > 0 &&
							values['new-password']?.length > 0 &&
							values['confirm-password']?.length > 0;

						// 2. Run redundant checks
						if (!changedPassword) {
							setError({
								name: 'InvalidPassword',
								message: 'You must fill out all the fields!',
							});
							actions.setSubmitting(false);
							return;
						}
						if (values['new-password'] !== values['confirm-password']) {
							actions.setFieldError('new-password', 'These fields must match.');
							actions.setFieldError('confirm-password', 'These fields must match.');
							actions.setSubmitting(false);
							return;
						}
						if (values['current-password'] === values['new-password']) {
							actions.setFieldError(
								'new-password',
								"Can't be the same as current password."
							);
							actions.setSubmitting(false);
							return;
						}

						// 3. Create and execute request
						try {
							const res = await fetch('/api/edit/security', {
								method: 'POST',
								body: JSON.stringify(values),
								headers: {
									'Content-Type': 'application/json',
								},
							});
							const status = res.status;
							const json = await res.json();

							switch (status) {
								case 200:
									if (json.ok) actions.resetForm();
									break;
								case 400:
									const { name, message } = json.error;
									if (name === 'InvalidData') setError({ name, message });
									else if (name === 'InvalidPassword') {
										actions.setFieldError('current-password', 'Invalid password.');
									}
									break;
								case 401:
									history.push('/login');
									break;
								case 500:
									setError({
										name: 'InternalServerError',
										message: 'Oops! Something went wrong! Please try again later!',
									});
									break;
							}
							actions.setSubmitting(false);
							return;
						} catch (e) {}
						setError({
							name: 'InternalServerError',
							message: 'Oops! Something went wrong! Please try again later!',
						});
						actions.setSubmitting(false);
					}}>
					<Form>
						<SecurityForm />
					</Form>
				</Formik>
			</Grid>
		</Layout>
	);
};
