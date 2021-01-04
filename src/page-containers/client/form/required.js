import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Field, useFormikContext } from 'formik';
import Typography from '@material-ui/core/Typography';
import isValidUrl from 'lib/isValidUrl';
import TextFormField from 'components/TextFormField';

const RedirectUri = React.memo((props) => {
	const { values } = useFormikContext();
	const { index, onAdd, onRemove, disableAdd, disableRemove } = props;
	return (
		<Grid item container spacing={1}>
			<Grid item xs={12}>
				<Field
					required
					size="small"
					variant="filled"
					component={TextFormField}
					name={`redirect_uris.${index}`}
					label={`Redirect URI #${index + 1}`}
					validate={(value) => {
						const isValid = isValidUrl(value || '');
						if (isValid) return;
						else {
							return 'Must provide a valid url.';
						}
					}}
				/>
			</Grid>
			<Grid item xs={12} container>
				<Grid item>
					<Button
						disabled={disableRemove}
						onClick={() => typeof onRemove === 'function' && onRemove(index)}>
						Remove
					</Button>
				</Grid>

				<Grid item>
					<Button
						color="primary"
						onClick={() => typeof onAdd === 'function' && onAdd(index)}
						disabled={
							disableAdd ||
							index !== values.redirect_uris.length - 1 ||
							!isValidUrl(values.redirect_uris[index] || '')
						}>
						Add
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
});
const RedirectUris = React.memo(() => {
	const { values, setFieldValue } = useFormikContext();
	if (values.redirect_uris.length <= 1) {
		return (
			<RedirectUri
				index={0}
				disableRemove
				onAdd={() => setFieldValue('redirect_uris', values.redirect_uris.concat(['']))}
				onRemove={(index) =>
					setFieldValue(
						'redirect_uris',
						values.redirect_uris.filter((_, i) => i !== index)
					)
				}
			/>
		);
	}

	return values.redirect_uris.map((_, index) => {
		return (
			<RedirectUri
				index={index}
				key={`${values.redirect_uris.length}-${index}`}
				onAdd={() => setFieldValue('redirect_uris', values.redirect_uris.concat(['']))}
				onRemove={() =>
					setFieldValue(
						'redirect_uris',
						values.redirect_uris.filter((_, i) => i !== index)
					)
				}
			/>
		);
	});
});

const ClientFormRequired = () => {
	return (
		<>
			<Grid item xs={12}>
				<Typography variant="h6">Required Inputs</Typography>
			</Grid>
			<Grid item xs={12}>
				<Field
					required
					size="small"
					variant="filled"
					name="client_name"
					label="Client Name"
					component={TextFormField}
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					required
					size="small"
					variant="filled"
					name="client_uri"
					label="Client Homepage"
					component={TextFormField}
					validate={(value) => {
						const isValid = isValidUrl(value || '');
						if (isValid) return;
						else {
							return 'Must provide a valid url.';
						}
					}}
				/>
			</Grid>

			<Grid xs={12} item container>
				<Grid item xs={12}>
					<Typography gutterBottom>Redirect URIs *</Typography>
				</Grid>

				<RedirectUris />
			</Grid>
		</>
	);
};

export default ClientFormRequired;
