import React from 'react';
import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ProfileForm from './form';
import Layout from 'components/Layout';
import getUserObject from 'lib/getUserObject';
import Unauthorized from 'components/Unauthorized';
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
	{ name: 'ProfilePage' }
);

export default () => {
	const styles = useStyles();

	const {
		setError,

		user,
		setUser,
	} = useInteraction();

	if (!user) {
		return <Unauthorized message={'You must be logged in to access this page.'} />;
	}

	const {
		email,
		phone,
		name: { last, first },
	} = user;

	return (
		<Layout>
			<Helmet>
				<title>Profile</title>
			</Helmet>
			<Grid container direction="column" className={styles.container}>
				<Formik
					enableReinitialize
					initialValues={{
						email,
						phone,
						password: '',
						lastname: last,
						firstname: first,
					}}
					onSubmit={async (values, actions) => {
						try {
							setError(null);
							actions.setSubmitting(true);

							const changedEmail = values.email !== email;
							const changedPhone = values.phone !== phone;
							const hasPassword = values.password?.length > 0;
							const changedLastName = values.lastname !== last;
							const changedFirstName = values.firstname !== first;

							if (changedEmail || changedPhone || changedLastName || changedFirstName) {
								if (!hasPassword) {
									actions.setFieldError(
										'password',
										'Must provide your password to save edits.'
									);
									actions.setSubmitting(false);
									return;
								}

								const res = await fetch('/api/edit/profile', {
									method: 'POST',
									body: JSON.stringify(values),
									headers: {
										'Content-Type': 'application/json',
									},
								});
								const json = await res.json();

								if (!res?.ok || !json?.ok || json.error) {
									if (json?.error?.name === 'InvalidPassword') {
										actions.setFieldError('password', 'Incorrect Password!');
										actions.setSubmitting(false);
										return;
									}

									setError({
										name: json?.error?.name || 'InternalServerError',
										message:
											json?.error?.message ||
											'Oops! Something went wrong! Please try again later.',
									});
									actions.setSubmitting(false);

									return;
								}

								if (json.ok && json?.data?.user) {
									const newUser = json.data.user;
									setUser((prev) => ({
										...prev,
										...newUser,
									}));
									actions.setFieldValue('password', '');
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
					}}>
					<Form>
						<ProfileForm />
					</Form>
				</Formik>
			</Grid>
		</Layout>
	);
};
