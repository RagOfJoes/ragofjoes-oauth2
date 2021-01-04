import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Field, useFormikContext } from 'formik';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextFormField from 'components/TextFormField';
import formatPhoneNumber from 'lib/formatPhoneNumber';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ shape, palette, spacing }) => ({
		paper: {
			width: '100%',
			maxWidth: 500,
			padding: spacing(2),
		},
		flash: {
			padding: spacing(1),
			borderRadius: shape.borderRadius,
			color: palette.primary.contrastText,
			backgroundColor: palette.error.main,
		},
	}),
	{ name: 'ProfileForm' }
);

export default () => {
	const styles = useStyles();
	const {
		values,
		isSubmitting,
		resetForm,
		submitForm,
		setFieldValue,
	} = useFormikContext();

	const { flash, error, user } = useInteraction();

	const changedEmail = values.email !== user.email;
	const changedPhone = values.phone !== user.phone;
	const changedLastName = values.lastname !== user.name.last;
	const changedFirstName = values.firstname !== user.name.first;

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h6">Profile</Typography>
				<Typography variant="body2" color="textSecondary">
					Personal Information that other applications will use to identify you.
				</Typography>
			</Grid>

			{(flash || error) && (
				<Grid item xs={12}>
					<div className={styles.flash}>
						<Typography variant="subtitle2">Error: {flash || error?.message}</Typography>
					</div>
				</Grid>
			)}

			<Grid item xs={12} md={6}>
				<Field
					variant="filled"
					name="firstname"
					label="First Name"
					component={TextFormField}
				/>
			</Grid>

			<Grid item xs={12} md={6}>
				<Field
					name="lastname"
					label="Last Name"
					variant="filled"
					component={TextFormField}
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					type="email"
					name="email"
					label="E-mail"
					variant="filled"
					component={TextFormField}
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					type="tel"
					name="phone"
					variant="filled"
					label="Phone Number"
					value={values.phone}
					component={TextFormField}
					onChange={(e) => setFieldValue('phone', formatPhoneNumber(e.target.value))}
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					name="password"
					type="password"
					variant="filled"
					label="Password"
					component={TextFormField}
				/>
			</Grid>

			<Grid item>
				<Button
					type="reset"
					variant="text"
					color="secondary"
					onClick={async () => await resetForm()}
					disabled={
						isSubmitting ||
						(!changedEmail && !changedPhone && !changedLastName && !changedFirstName)
					}>
					Discard Changes
				</Button>
			</Grid>

			<Grid item>
				<Button
					type="submit"
					color="primary"
					variant="contained"
					onClick={async () => await submitForm()}
					disabled={
						isSubmitting ||
						(!changedEmail && !changedPhone && !changedLastName && !changedFirstName)
					}>
					Save Changes
				</Button>
			</Grid>
		</Grid>
	);
};
