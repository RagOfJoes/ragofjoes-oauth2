import React from 'react';
import List from '@material-ui/core/List';
import DnsIcon from '@material-ui/icons/Dns';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import SecurityIcon from '@material-ui/icons/Security';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';

const drawerWidth = 240;

const useStyles = makeStyles(
	(theme) => ({
		drawerPaper: {
			width: drawerWidth,
			paddingTop: theme.spacing(3),
			border: '0px solid transparent',

			[theme.breakpoints.down('xs')]: {
				borderTopRightRadius: theme.shape.borderRadius * 4,
				borderBottomRightRadius: theme.shape.borderRadius * 4,
			},
		},
		titleContainer: {
			padding: theme.spacing(0, 2),
		},
		title: {
			textTransform: 'uppercase',
		},
		list: {
			marginTop: theme.spacing(2),
		},
		item: {
			cursor: 'pointer',
			padding: theme.spacing(2.25, 2),
			'&::before': {
				inset: 0,
				content: '""',
				position: 'absolute',
				transform: 'scale(0.8, 0.7)',
				backgroundColor: 'transparent',
				transition: theme.transitions.create(),
			},

			'&:hover::before': {
				opacity: 0.6,
				transform: 'scale(1)',
				backgroundColor: theme.palette.background.default,
			},
		},
		itemSelected: {
			backgroundColor: `${theme.palette.background.default} !important`,

			'& .MuiAvatar-root': {
				backgroundColor: theme.palette.primary.main,
			},
		},
		avatar: {
			width: theme.spacing(4),
			height: theme.spacing(4),
			color: theme.palette.background.paper,
			backgroundColor: theme.palette.text.secondary,
		},
	}),
	{ name: 'Drawer' }
);

const CustomDrawer = (props) => {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const { mobileOpen, handleDrawerToggle } = props;

	const routes = [
		{
			name: 'Profile',
			route: ['/', '/profile'],
			Icon: <PersonIcon fontSize="inherit" />,
		},
		{ name: 'Security', route: ['/security'], Icon: <SecurityIcon fontSize="inherit" /> },
		{
			name: 'Client',
			route: ['/client'],
			Icon: <DnsIcon fontSize="inherit" />,
		},
	];
	const Content = (
		<>
			<div className={classes.titleContainer}>
				<Typography variant="subtitle2" color="textPrimary" className={classes.title}>
					Menu
				</Typography>
			</div>
			<List className={classes.list}>
				{routes.map((item, index) => {
					const matchRoute = item.route.includes(location.pathname);
					const redirectRoute = Array.isArray(item.route) ? item.route[0] : item.route;
					const style =
						index === routes.length - 1
							? {
									marginTop: 'auto',
							  }
							: {};
					return (
						<ListItem
							style={style}
							key={item.name}
							selected={!!matchRoute}
							className={classes.item}
							onClick={() => history.push(redirectRoute)}
							classes={{ selected: classes.itemSelected }}>
							<ListItemAvatar>
								<Avatar variant="rounded" className={classes.avatar}>
									{item.Icon}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={item.name}
								style={{ zIndex: 1 }}
								primaryTypographyProps={{ variant: 'subtitle2' }}
							/>
						</ListItem>
					);
				})}
			</List>

			<a href="/logout" style={{ marginTop: 'auto', textDecoration: 'none' }}>
				<ListItem className={classes.item}>
					<ListItemAvatar>
						<Avatar variant="rounded" className={classes.avatar}>
							<ExitToAppRoundedIcon fontSize="inherit" />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary="Logout"
						style={{ zIndex: 1 }}
						primaryTypographyProps={{ variant: 'subtitle2', color: 'textSecondary' }}
					/>
				</ListItem>
			</a>
		</>
	);

	return (
		<>
			<Hidden smUp implementation="js">
				<Drawer
					open={mobileOpen}
					variant="temporary"
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					classes={{
						paper: classes.drawerPaper,
					}}>
					{Content}
				</Drawer>
			</Hidden>
			<Hidden xsDown implementation="js">
				<Drawer
					open
					variant="permanent"
					classes={{
						paper: classes.drawerPaper,
					}}>
					{Content}
				</Drawer>
			</Hidden>
		</>
	);
};

export default CustomDrawer;
