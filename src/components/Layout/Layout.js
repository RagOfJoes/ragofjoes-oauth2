import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Container from '@material-ui/core/Container';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import Drawer from './Drawer';

const drawerWidth = 240;

const useStyles = makeStyles(
	(theme) => ({
		drawer: {
			[theme.breakpoints.up('sm')]: {
				flexShrink: 0,
				width: drawerWidth,
			},
		},
		appBar: {
			[theme.breakpoints.up('sm')]: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
			},
		},
		menuButton: {
			marginRight: theme.spacing(2),
			[theme.breakpoints.up('sm')]: {
				display: 'none',
			},
		},
		content: {
			flexGrow: 1,
			height: '100vh',
			backgroundColor: theme.palette.background.paper,
		},
		wrapper: {
			flexGrow: 1,
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'column',
			padding: theme.spacing(3, 2),
			backgroundColor: theme.palette.background.default,

			[theme.breakpoints.up('sm')]: {
				padding: theme.spacing(3, 4),
				borderTopLeftRadius: theme.shape.borderRadius * 4,
				borderBottomLeftRadius: theme.shape.borderRadius * 4,
			},
		},
		burgerContainer: {
			width: '100%',
			display: 'flex',
			marginBottom: theme.spacing(3),
		},
		burger: {
			cursor: 'pointer',
			transition: theme.transitions.create(),
			color: theme.palette.background.default,
			backgroundColor: theme.palette.primary.main,
		},
	}),
	{ name: 'Layout' }
);

const Layout = (props) => {
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = useState(false);
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	return (
		<>
			<nav className={classes.drawer} aria-label="nav">
				<Drawer
					mobileOpen={mobileOpen}
					setMobileOpen={setMobileOpen}
					handleDrawerToggle={handleDrawerToggle}
				/>
			</nav>
			<main className={classes.content}>
				<div className={classes.wrapper}>
					<Container maxWidth="lg">
						<Hidden smUp>
							<div className={classes.burgerContainer}>
								<Avatar
									variant="rounded"
									onKeyDown={() => {}}
									className={classes.burger}
									onClick={() => setMobileOpen(true)}>
									<MenuRoundedIcon />
								</Avatar>
							</div>
						</Hidden>
						{props.children}
					</Container>
				</div>
			</main>
		</>
	);
};

export default Layout;
