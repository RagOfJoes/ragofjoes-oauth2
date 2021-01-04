import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import BoostedApe from 'components/BoostedApe';
import { fade } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Field, useFormikContext } from 'formik';
import Checkbox from '@material-ui/core/Checkbox';
import TextFormField from 'components/TextFormField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useInteraction } from 'components/Providers/InteractionProvider';

const useStyles = makeStyles(
	({ shape, palette, spacing, transitions, typography }) => ({
		paper: {
			width: '100%',
			maxWidth: 385,
			padding: spacing(3),
		},
		flash: {
			padding: spacing(2),
			borderRadius: shape.borderRadius,
			color: palette.primary.contrastText,
			backgroundColor: palette.primary.main,
		},
		show: {
			color: fade(palette.text.primary, 0.6),
			transition: transitions.create('color'),

			'&:hover': {
				color: palette.text.primary,
			},
		},
		notShow: {
			color: fade(palette.primary.main, 0.6),
			transition: transitions.create('color'),

			'&:hover': {
				color: palette.primary.main,
			},
		},
		label: typography.button,
	}),
	{ name: 'LoginForm' }
);

export default () => {
	const styles = useStyles();
	const { flash, client } = useInteraction();
	const { submitForm, setFieldValue } = useFormikContext();
	const [showPassword, toggleShowPassword] = useState(false);

	return (
		<Paper className={styles.paper}>
			<Grid container spacing={2} direction="column">
				<Grid item container justify="center">
					<BoostedApe width={100} animated moisture />
				</Grid>

				<Grid item container justify="center">
					<Typography variant="h6" align="center" component="span">
						Sign-in to{' '}
						<Typography variant="h6" align="center" color="primary" component="strong">
							{client.clientName}
						</Typography>
					</Typography>
				</Grid>

				{flash && (
					<Grid item className={styles.flash}>
						<Typography variant="subtitle2">Error: {flash}</Typography>
					</Grid>
				)}

				<Grid item>
					<Field
						type="email"
						name="login"
						label="Username"
						variant="filled"
						component={TextFormField}
					/>
				</Grid>

				<Grid item>
					<Field
						fullWidth
						margin="none"
						name="password"
						label="Password"
						variant="filled"
						component={TextFormField}
						type={showPassword ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => toggleShowPassword(!showPassword)}
										onMouseDown={() => toggleShowPassword(!showPassword)}>
										{showPassword ? (
											<Visibility className={styles.show} />
										) : (
											<VisibilityOff className={styles.notShow} />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>

				<Grid item container spacing={2} justify="space-between" alignItems="center">
					<Grid item xs={12} sm={6} className={styles.remember}>
						<FormControlLabel
							label="Remember Me"
							classes={{ label: styles.label }}
							control={
								<Checkbox
									size="small"
									color="primary"
									inputProps={{ 'aria-label': 'remember me' }}
									onChange={(e) => setFieldValue('remember_me', e.target.value)}
								/>
							}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Tooltip title="Still a W.I.P">
							<Button fullWidth>Forget Password?</Button>
						</Tooltip>
					</Grid>
				</Grid>

				<Grid item container spacing={2} justify="space-between">
					<Grid item xs={12}>
						<Button
							fullWidth
							color="primary"
							variant="outlined"
							onClick={async () => {
								setFieldValue('new_user', true);
								await submitForm();
							}}>
							Sign-up instead
						</Button>
					</Grid>

					<Grid item xs={12}>
						<Button type="submit" fullWidth color="primary" variant="contained">
							Submit
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</Paper>
	);
};
