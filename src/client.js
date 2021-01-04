import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';
import theme from 'lib/theme';
import InteractionProvider from './components/Providers/InteractionProvider';

const getInitData = () => {
	try {
		return window.__INIT_DATA__;
	} catch (e) {}

	return {};
};

hydrate(
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<InteractionProvider {...getInitData()}>
				<CssBaseline />
				<App />
			</InteractionProvider>
		</ThemeProvider>
	</BrowserRouter>,
	document.getElementById('mount-node'),
	() => {
		try {
			// [ReHydratation](https://github.com/cssinjs/jss/blob/master/docs/ssr.md)
			const jssStyles = document.getElementById('jss-ssr');
			if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);
		} catch (e) {}
	}
);

if (module.hot) {
	module.hot.accept();
}
