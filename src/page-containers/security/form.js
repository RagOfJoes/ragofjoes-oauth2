import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Field, useFormikContext } from 'formik';
import TextFormField from 'components/TextFormField';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
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
	{ name: 'SecurityForm' }
);

export default () => {
	const styles = useStyles();
	const { values, isSubmitting, resetForm, submitForm } = useFormikContext();

	const { flash, error } = useInteraction();

	const changedPassword =
		values['current-password']?.length > 0 &&
		values['new-password']?.length > 0 &&
		values['confirm-password']?.length > 0;

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography variant="h6">Account Security</Typography>
				<Typography variant="body2" color="textSecondary">
					Change your password, manage 2FA (WIP) and manage active sessions / access
					tokens (WIP)
				</Typography>
			</Grid>

			{(flash || error) && (
				<Grid item xs={12}>
					<div className={styles.flash}>
						<Typography variant="subtitle2">Error: {flash || error?.message}</Typography>
					</div>
				</Grid>
			)}

			<Grid item xs={12}>
				<Field
					type="password"
					variant="filled"
					name="current-password"
					label="Current Password"
					component={TextFormField}
					autoComplete="current-password"
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					type="password"
					variant="filled"
					name="new-password"
					label="New Password"
					component={TextFormField}
					autoComplete="new-password"
					helperText="Must be between 6-100 characters long."
					validate={(value) => {
						if (value.length < 6 || value.length > 100) {
							return 'Must be between 6-100 characters long.';
						}
						if (value === values['current-password']) {
							return "Can't be the same as current password.";
						}
						return null;
					}}
				/>
			</Grid>

			<Grid item xs={12}>
				<Field
					type="password"
					variant="filled"
					autoComplete="true"
					name="confirm-password"
					component={TextFormField}
					label="Confirm New Password"
					helperText="Must be between 6-100 characters long."
					validate={(value) => {
						if (value !== values['new-password']) {
							return 'Must match New Password input.';
						}
						return null;
					}}
				/>
			</Grid>

			<Grid item>
				<Button
					type="reset"
					variant="text"
					color="secondary"
					onClick={async () => await resetForm()}
					disabled={isSubmitting || !changedPassword}>
					Discard Changes
				</Button>
			</Grid>

			<Grid item>
				<Button
					type="submit"
					color="primary"
					variant="contained"
					onClick={async () => await submitForm()}
					disabled={isSubmitting || !changedPassword}>
					Save Changes
				</Button>
			</Grid>
		</Grid>
	);
};
