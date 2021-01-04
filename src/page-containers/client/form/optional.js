import React from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import { Field, useFormikContext } from 'formik';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import isValidUrl from 'lib/isValidUrl';
import TextFormField from 'components/TextFormField';
import { subjectTypes, responseTypes, applicationTypes } from 'provider/config/exported';

const ClientFormOptional = () => {
	const { values, setFieldValue } = useFormikContext();
	return (
		<>
			<Grid item xs={12}>
				<Typography variant="h6">Optional Inputs</Typography>
			</Grid>

			<Grid item xs={12} md={6}>
				<Field
					size="small"
					name="tos_uri"
					variant="filled"
					label="Terms of Service Url"
					component={TextFormField}
					validate={(value) => {
						const isValid = isValidUrl(value || '');
						if (isValid || value?.length === 0) return;
						else {
							return 'Must provide a valid url.';
						}
					}}
				/>
			</Grid>

			<Grid item xs={12} md={6}>
				<Field
					size="small"
					variant="filled"
					name="policy_uri"
					label="Policy Url"
					component={TextFormField}
					validate={(value) => {
						const isValid = isValidUrl(value || '');
						if (isValid || value?.length === 0) return;
						else {
							return 'Must provide a valid url.';
						}
					}}
				/>
			</Grid>

			<Grid item xs={12} md={4}>
				<FormControl component="fieldset">
					<FormLabel component="legend">Subject Type</FormLabel>
					<RadioGroup
						name="subject_type"
						aria-label="subject_type"
						value={values.subject_type}
						onChange={(e) => setFieldValue('subject_type', e.target.value)}>
						{subjectTypes.map((type) => (
							<FormControlLabel
								key={type.value}
								value={type.value}
								label={type.label}
								control={<Radio inputProps={{ 'aria-label': type.label }} />}
							/>
						))}
					</RadioGroup>
				</FormControl>
			</Grid>

			<Grid item xs={12} md={4}>
				<FormControl component="fieldset">
					<FormLabel component="legend">Application Type</FormLabel>
					<RadioGroup
						name="application_type"
						aria-label="application_type"
						value={values.application_type}
						onChange={(e) => setFieldValue('application_type', e.target.value)}>
						{applicationTypes.map((type) => (
							<FormControlLabel
								key={type.value}
								value={type.value}
								label={type.label}
								control={<Radio inputProps={{ 'aria-label': type.label }} />}
							/>
						))}
					</RadioGroup>
				</FormControl>
			</Grid>

			<Grid item xs={12} md={4}>
				<FormControl component="fieldset">
					<FormLabel component="legend">Response Types</FormLabel>
					<RadioGroup
						name="response_types"
						aria-label="response_types"
						value={values.response_types[0]}
						onChange={(e) => setFieldValue('response_types', [e.target.value])}>
						{responseTypes.map((type) => (
							<FormControlLabel
								key={type.value}
								value={type.value}
								label={type.label}
								control={<Radio inputProps={{ 'aria-label': type.label }} />}
							/>
						))}
					</RadioGroup>
				</FormControl>
			</Grid>
		</>
	);
};

export default ClientFormOptional;
