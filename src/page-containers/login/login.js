import React from 'react';
import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LoginForm from './form';
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
	{ name: 'Login' }
);

export default () => {
	const styles = useStyles();
	const history = useHistory();
	const { prompt, setUser, setError } = useInteraction();

	return (
		<Container>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<Formik
					initialValues={{
						password: '',
						remember_me: false,
						login: prompt?.details?.login_hint ?? '',
					}}
					onSubmit={async (values, actions) => {
						try {
							setError(null);
							actions.setSubmitting(true);
							const res = await fetch('/api/login', {
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
								actions.setSubmitting(false);
								history.push('/');
								return;
							}
						} catch (e) {}
						actions.setSubmitting(false);
					}}>
					{({}) => {
						return (
							<Form className={styles.form}>
								<LoginForm />
							</Form>
						);
					}}
				</Formik>
			</Grid>
		</Container>
	);
};
