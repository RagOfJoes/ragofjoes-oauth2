import React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Error from 'pages/error';
import Login from 'pages/login';
import Signup from 'pages/signup';
import Client from 'pages/client';
import Profile from 'pages/profile';
import Security from 'pages/security';
import Redirect from 'pages/redirect';
import Interaction from 'pages/interaction';

const App = () => {
	return (
		<>
			<Helmet
				titleTemplate="%s | RagOfJoes"
				encodeSpecialCharacters={true}
				defaultTitle="Auth | RagOfJoes"
			/>
			<Switch>
				{/* OIDC specific routes */}
				<Route path="/auth" component={Redirect} />
				<Route
					component={Interaction}
					path={['/interaction', '/logout', '/logout/success']}
				/>
				{/* Auth flows outside OIDC */}
				<Route exact path={'/login'} component={Login} />
				<Route exact path={'/signup'} component={Signup} />
				<Route exact path={['/', '/profile']} component={Profile} />
				<Route exact path={'/security'} component={Security} />
				<Route exact path={'/client'} component={Client} />
				{/* Fallback route */}
				<Route component={Error} />
			</Switch>
		</>
	);
};

export default App;
