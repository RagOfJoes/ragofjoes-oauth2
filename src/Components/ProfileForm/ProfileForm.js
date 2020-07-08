import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BoostedApe from 'Components/BoostedApe';
import { Field, useFormikContext } from 'formik';
import TextFormField from 'Components/TextFormField';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useInteraction } from 'lib/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ shape, palette, spacing }) => ({
		paper: {
			width: '100%',
			maxWidth: 500,
			padding: spacing(2),
		},
		flash: {
			padding: spacing(2),
			borderRadius: shape.borderRadius,
			color: palette.primary.contrastText,
			backgroundColor: palette.primary.main,
		},
	}),
	{ name: 'ProfileForm' }
);

export default () => {
	const styles = useStyles();
	const { isSubmitting, submitForm } = useFormikContext();
	const [newPassword, toggleNewPassword] = useState(false);

	const { flash, error } = useInteraction();

	return (
		<Paper elevation={2} className={styles.paper}>
			<Grid container direction="column" spacing={2}>
				<Grid item container justify="center">
					<BoostedApe width={100} animated moisture />
				</Grid>

				<Grid item>
					<Typography variant="h6">Profile</Typography>
					<Typography variant="body2">Personal Information that other applications will use to identify you.</Typography>
				</Grid>

				{(flash || error) && (
					<Grid item className={styles.flash}>
						<Typography variant="subtitle2">Error: {flash || error?.message}</Typography>
					</Grid>
				)}

				<Grid item container spacing={1}>
					<Grid item xs={12} md={6}>
						<Field variant="filled" name="firstname" label="First Name" component={TextFormField} />
					</Grid>

					<Grid item xs={12} md={6}>
						<Field name="lastname" label="Last Name" variant="filled" component={TextFormField} />
					</Grid>
				</Grid>

				<Grid item>
					<Field type="email" name="email" label="Email" variant="filled" component={TextFormField} />
				</Grid>

				<Grid item>
					<Field
						type="password"
						variant="filled"
						name="currentPassword"
						label="Current Password"
						component={TextFormField}
					/>
				</Grid>

				{!newPassword && (
					<Grid item>
						<Button onClick={() => toggleNewPassword(true)}>Change Password</Button>
					</Grid>
				)}

				{newPassword && (
					<Grid item>
						<Field type="password" variant="filled" name="newPassword" label="New Password" component={TextFormField} />
					</Grid>
				)}

				<Grid item container justify="flex-end">
					<Button color="primary" variant="contained" disabled={isSubmitting} onClick={async () => await submitForm()}>
						Save
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};
