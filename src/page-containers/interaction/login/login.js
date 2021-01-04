import React from 'react';
import Helmet from 'react-helmet';
import { Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import LoginForm from './form';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
	{ name: 'LoginInteraction' }
);

export default () => {
	const styles = useStyles();
	const { uid, prompt } = useInteraction();

	return (
		<Container>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<Grid container justify="center" alignItems="center" className={styles.container}>
				<Formik
					initialValues={{
						login: prompt?.details?.login_hint ?? '',
						password: '',
						remember_me: false,
					}}
					onSubmit={async (values, actions) => {
						try {
							// Send Form Synchronously
							// to allow node-oidc-provider
							// to handle the auth flow
							const form = document.createElement('form');
							form.method = 'POST';
							form.action = `/interaction/${uid}/login`;
							form.style.display = 'none';

							Object.keys(values).map((v) => {
								const input = document.createElement('input');
								input.type = 'hidden';
								input.name = v;
								input.value = values[v];
								form.appendChild(input);
							});

							document.body.appendChild(form);
							form.submit();
						} catch (e) {}
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
