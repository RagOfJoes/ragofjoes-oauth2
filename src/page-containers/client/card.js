import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

const useStyles = makeStyles(
	(theme) => ({
		card: {
			width: '100%',
		},
		chip: {
			textTransform: 'capitalize',
		},
	}),
	{ name: 'ClientCard' }
);

export default (props) => {
	const styles = useStyles();
	const [confirmDialog, updateConfirmDialog] = useState(false);
	const { id, name, onEdit, onDelete, loading, subjectType, applicationType } = props;
	if (loading) {
		return (
			<Card className={styles.card}>
				<Grid item container spacing={1} component={CardContent}>
					<Grid xs={12} item>
						<Skeleton width="80%">
							<Typography variant="caption" color="textSecondary">
								_____
							</Typography>
						</Skeleton>
					</Grid>

					<Grid xs={12} item>
						<Skeleton width="60%">
							<Typography variant="h5">____</Typography>
						</Skeleton>
					</Grid>

					<Grid xs={12} item container spacing={1}>
						<Grid item>
							<Skeleton width="100%">
								<Chip
									size="small"
									color="primary"
									label="________"
									className={styles.chip}
								/>
							</Skeleton>
						</Grid>

						<Grid item>
							<Skeleton width="100%">
								<Chip
									size="small"
									color="primary"
									label="________"
									className={styles.chip}
								/>
							</Skeleton>
						</Grid>
					</Grid>
				</Grid>

				<CardActions>
					<Button disabled startIcon={<DeleteForeverRoundedIcon />}>
						Delete
					</Button>

					<Button disabled startIcon={<EditIcon />}>
						Edit
					</Button>
				</CardActions>
			</Card>
		);
	}

	return (
		<>
			<Card className={styles.card}>
				<Grid item container spacing={1} component={CardContent}>
					<Grid xs={12} item>
						<Typography variant="caption" color="textSecondary">
							Client ID: #{id}
						</Typography>
					</Grid>

					<Grid xs={12} item>
						<Typography variant="h5">{name}</Typography>
					</Grid>

					<Grid xs={12} item container spacing={1}>
						<Grid item>
							<Chip
								size="small"
								color="primary"
								label={subjectType}
								className={styles.chip}
							/>
						</Grid>

						<Grid item>
							<Chip
								size="small"
								color="primary"
								label={applicationType}
								className={styles.chip}
							/>
						</Grid>
					</Grid>
				</Grid>

				<CardActions>
					<Button
						startIcon={<DeleteForeverRoundedIcon />}
						onClick={() => typeof onDelete === 'function' && updateConfirmDialog(true)}>
						Delete
					</Button>
					<Button
						startIcon={<EditIcon />}
						onClick={() => typeof onEdit === 'function' && onEdit(id)}>
						Edit
					</Button>
				</CardActions>
			</Card>

			<Dialog
				open={confirmDialog}
				disableBackdropClick
				disableEscapeKeyDown
				PaperProps={{ elevation: 0 }}>
				<DialogTitle>Confirm</DialogTitle>
				<DialogContent dividers>
					<Typography variant="body1">Are you sure you want to delete {name}?</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						color="primary"
						variant="contained"
						onClick={() => updateConfirmDialog(false)}>
						No
					</Button>
					<Button onClick={() => typeof onDelete === 'function' && onDelete(id)}>
						Yes
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
