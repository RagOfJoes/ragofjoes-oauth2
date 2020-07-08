import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ErrorCard from 'Components/ErrorCard';
import ProfileForm from 'Components/ProfileForm';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInteraction } from 'lib/Providers/InteractionProvider';

const useStyles = makeStyles(
	({}) => ({
		container: {
			height: '100vh',
		},
		form: {
			width: '100%',
		},
	}),
	{ name: 'ProfilePage' }
);

export default () => {
	const styles = useStyles();
	const [newPassword, toggleNewPassword] = useState(false);

	const {
		setError,

		user,
		setUser,
	} = useInteraction();

	if (!user) {
		return (
			<Container maxWidth="md">
				<Helmet>
					<title>Unauthorized</title>
				</Helmet>

				<Grid container justify="center" alignItems="center" className={styles.container}>
					<ErrorCard message="You must be loggedin to access this page!" />
				</Grid>
			</Container>
		);
	}

	const {
		email,
		name: { full, last, first },
	} = user;

	return (
		<Container maxWidth="md">
			<Helmet>
				<title>{full}</title>
			</Helmet>
			<Grid container direction="column" justify="center" alignItems="center" className={styles.container}>
				<Formik
					initialValues={{ firstname: first, lastname: last, email, currentPassword: '', newPassword: '' }}
					onSubmit={async (values, actions) => {
						try {
							actions.setSubmitting(true);
							setError(null);

							const changedEmail = values.email !== email;
							const changedLastName = values.lastname !== last;
							const changedFirstName = values.firstname !== first;
							const hasCurrentPassword = values.currentPassword && values.currentPassword.length > 0;
							const changedPassword = newPassword && values.newPassword && values.newPassword.length > 0;
							if (changedEmail || changedLastName || changedFirstName || changedPassword) {
								if (!hasCurrentPassword) {
									actions.setFieldError('currentPassword', 'Must provide your current password to save edits');
									actions.setSubmitting(false);
									return;
								}

								const res = await fetch('/api/profile/edit', {
									method: 'POST',
									body: JSON.stringify(values),
									headers: {
										'Content-Type': 'application/json',
									},
								});
								const json = await res.json();

								if (!res.ok || !json || !json.ok || json.error) {
									if (json?.error?.name === 'InvalidPassword') {
										actions.setFieldError('currentPassword', 'Incorrect Password!');
										actions.setSubmitting(false);
										return;
									}

									setError({
										name: json?.error?.name || 'InternalServerError',
										message: json?.error?.message || 'Oops! Something went wrong! Please try again later.',
									});
									actions.setSubmitting(false);

									return;
								}

								if (json.ok && json.user) {
									const { user } = json;
									setUser({
										email: user.email,
										name: {
											last: user.family_name,
											first: user.given_name,
											full: user.given_name + ' ' + user.family_name,
										},
									});
									actions.setSubmitting(false);
									actions.resetForm();

									if (newPassword) toggleNewPassword(false);
									return;
								}

								actions.setSubmitting(false);
								return;
							}
						} catch (e) {}
						// Fallback
						setError({
							name: 'InternalServerError',
							message: 'Oops! Something went wrong! Please try again later.',
						});
						actions.setSubmitting(false);

						return;
					}}>
					{({}) => {
						return (
							<Form>
								<ProfileForm />
							</Form>
						);
					}}
				</Formik>
			</Grid>
		</Container>
	);
};
