import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';

// Configure Material UI theme
const theme = responsiveFontSizes(
	createMuiTheme({
		palette: {
			primary: {
				main: '#D2516B',
				dark: '#802A3B',
				light: '#EB8197',
			},
			text: {
				primary: '#BBABAE',
				secondary: '#6A6364',
			},
			background: {
				paper: '#323239',
				default: '#35353D',
			},
		},
	})
);

export default theme;
