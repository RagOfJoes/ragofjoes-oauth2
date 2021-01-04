import { Form, Formik } from 'formik';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Required from './required';
import Optional from './optional';
import isValidUrl from 'lib/isValidUrl';

const useStyles = makeStyles(
	(theme) => ({
		form: {
			width: '100%',
		},
	}),
	{ name: 'ClientForm' }
);

/**
 * @typedef {{client_id: string, client_uri: string, client_name: string, redirect_uris: array.<string>, tos_url: string, policy_url: string, subject_type: 'public'|'pairwise', application_type: 'web'|'native', response_type: array.<string>}} ClientMetadata
 * @param {Object} props
 * @param {'edit'|'create'} props.type
 * @param {ClientMetadata} props.initialValues
 */
const ClientForm = (props) => {
	const { type, open, setDialog, onSubmitted, onSubmitting, initialValues } = props;
	const styles = useStyles();
	return (
		<Formik
			enableReinitialize
			initialValues={{
				...{
					client_uri: '',
					client_name: '',
					redirect_uris: [''],
					// Optionals
					tos_uri: '',
					policy_uri: '',
					subject_type: 'public',
					application_type: 'web',
					response_types: ['code'],
				},
				...initialValues,
			}}
			onSubmit={async (values, actions) => {
				// 1. Validate fields
				typeof onSubmitting === 'function' && onSubmitting();
				const requiredFields = [
					{ name: 'client_uri', type: 'url' },
					{ name: 'client_name', type: 'text' },
					{ name: 'redirect_uris', type: 'array_url' },
				];
				let dirty = false;
				actions.setSubmitting(true);
				const validateTypes = (field) => {
					const { name, type } = field;
					const value = values[name];
					switch (type) {
						case 'url':
							if (!value) {
								dirty = true;
								actions.setFieldError(name, 'Must fill out field.');
							}
							if (!isValidUrl(value || '')) {
								dirty = true;
								actions.setFieldError(name, 'Must provide a valid url.');
							}
							break;
						case 'array_url':
							if (!Array.isArray(value)) {
								actions.setFieldValue(name, [value]);
							}
							value.forEach((v) => {
								if (!v) {
									dirty = true;
									actions.setFieldError(name, 'Must fill out field.');
								}
								if (!isValidUrl(v)) {
									dirty = true;
									actions.setFieldError(name, 'Must provide a valid url.');
								}
							});
							break;
						case 'radio':
							if (!value) {
								dirty = true;
								actions.setFieldError(name, 'Must select a value.');
							}
							if (!field.validFields.includes(value)) {
								dirty = true;
								actions.setFieldError(name, 'Must select a valid value.');
							}
							break;
						// Text
						default:
							if (!value || value?.length === 0) {
								dirty = true;
								actions.setFieldError(name, 'Must fill out field.');
							}
							break;
					}
				};
				requiredFields.forEach((field) => validateTypes(field));
				// optionalFields.forEach((field) => validateTypes(field));
				if (dirty) return;

				// 2. Figure out how to send form
				try {
					const url =
						type === 'edit'
							? `/api/client/register/${initialValues.client_id}`
							: '/api/client/register';
					const validReqKeys = [
						'tos_uri',
						'client_id',
						'client_uri',
						'policy_uri',
						'client_name',
						'subject_type',
						'redirect_uris',
						'response_types',
						'application_type',
					];
					const filteredBody = {};
					Object.keys(values).forEach((v) => {
						if (validReqKeys.indexOf(v) !== -1) {
							if (typeof values[v] === 'string') {
								if (values[v].length > 0) filteredBody[v] = values[v];
							} else filteredBody[v] = values[v];
						}
					});
					const res = await fetch(url, {
						body: JSON.stringify(filteredBody),
						method: type === 'create' ? 'POST' : 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
					});
					const json = await res.json();
					const filteredResponse = {};
					Object.keys(values).forEach((v) => {
						if (validReqKeys.indexOf(v) !== -1) {
							filteredResponse[v] = json[v];
						}
					});
					typeof onSubmitted === 'function' && onSubmitted(filteredResponse);
					setDialog({ open: false, client: undefined });
				} catch (e) {}
			}}>
			{({ values, submitForm, isSubmitting }) => (
				<Form className={styles.form}>
					<Dialog
						open={open}
						maxWidth="md"
						scroll="body"
						onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
						onExited={() => setDialog({ open: false, client: undefined })}
						PaperProps={{
							elevation: 0,
						}}>
						<DialogTitle>
							{type === 'edit' ? `Edit ${values.client_name}` : 'Create new Client'}
						</DialogTitle>

						<DialogContent dividers>
							<Grid container spacing={2}>
								<Required />
								<Optional />
							</Grid>
						</DialogContent>

						<DialogActions>
							<Button
								type="submit"
								color="primary"
								disabled={isSubmitting}
								onClick={() => submitForm()}>
								{type === 'create' ? 'Save Changes' : 'Update Changes'}
							</Button>
						</DialogActions>
					</Dialog>
				</Form>
			)}
		</Formik>
	);
};

export default ClientForm;
