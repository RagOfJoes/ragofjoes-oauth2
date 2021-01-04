import React from 'react';
import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SignupForm from './form';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({}) => ({
		container: {
			height: '100vh',
		},
		form: {
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
		},
	}),
	{ name: 'Signup' }
);

export default () => {
	const styles = useStyles();
	const history = useHistory();
	const { setUser, setError } = useInteraction();

	return (
		<Container>
			<Helmet>
				<title>Signup</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<Formik
					initialValues={{ family_name: '', given_name: '', email: '', password: '' }}
					onSubmit={async (values, actions) => {
						try {
							setError(null);
							actions.setSubmitting(true);
							const res = await fetch('/api/signup', {
								method: 'POST',
								body: JSON.stringify(values),
								headers: {
									'Content-Type': 'application/json',
								},
							});
							const json = await res.json();

							if (!json?.ok) {
								if (json?.error) {
									setError(json.error);
								}
							} else {
								const { user } = json.data;
								setUser(user);
								history.push('/');
							}
						} catch (e) {}
						actions.setSubmitting(false);
					}}>
					{({}) => {
						return (
							<Form className={styles.form}>
								<SignupForm />
							</Form>
						);
					}}
				</Formik>
			</Grid>
		</Container>
	);
};
