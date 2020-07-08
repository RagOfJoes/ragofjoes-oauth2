import './App.css';
import React from 'react';
import Error from './Pages/Error';
import Helmet from 'react-helmet';
import Profile from './Pages/Profile';
import Redirect from './Pages/Redirect';
import Interaction from './Pages/Interaction';
import { Route, Switch } from 'react-router-dom';

const App = () => {
	return (
		<>
			<Helmet defaultTitle="Auth | RagOfJoes" titleTemplate="%s | RagOfJoes" encodeSpecialCharacters={true}>
				<link rel="shortcut icon" href="favicon.ico" />
			</Helmet>
			<Switch>
				<Route path="/auth" component={Redirect} />
				<Route path={['/', '/profile']} exact component={Profile} />
				<Route path={['/interaction', '/session/end', '/session/end/success']} component={Interaction} />
				<Route component={Error} />
			</Switch>
		</>
	);
};

export default App;
