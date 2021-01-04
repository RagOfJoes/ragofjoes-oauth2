import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';

// Configure Material UI theme
const theme = responsiveFontSizes(
	createMuiTheme({
		palette: {
			type: 'dark',
			primary: {
				main: '#a2bdfb',
				dark: '#617bb9',
				light: '#a0b1d6',
			},
			secondary: {
				main: '#ced0d7',
				dark: '#adb3ca',
				light: '#ffffff',
			},
			error: {
				main: '#e6675e',
				dark: '#cc3d33',
				light: '#ff938c',
			},
			text: {
				primary: '#ced0d7',
				secondary: '#a4b2d4',
			},
			background: {
				paper: '#21212b',
				default: '#252733',
			},
		},
		overrides: {
			MuiFilledInput: {
				root: {
					'&$disabled': {
						backgroundColor: 'rgba(135, 160, 197, 0.2)',
					},
				},
			},
			MuiFormLabel: {
				root: {
					color: '#ced0d7',
					'&$disabled': {
						color: 'rgba(255, 255, 255, 0.4)',
					},
				},
			},
			MuiFormControlLabel: {
				label: {
					'&$disabled': {
						color: 'rgba(255, 255, 255, 0.4)',
					},
				},
			},
			MuiButton: {
				root: {
					'&$disabled': {
						color: 'rgba(255, 255, 255, 0.4)',
					},
				},
				contained: {
					'&$disabled': {
						color: 'rgba(255, 255, 255, 0.4)',
					},
				},
			},
			MuiIconButton: {
				root: {
					'&$disabled': {
						color: 'rgba(255, 255, 255, 0.4)',
					},
				},
			},
		},
	})
);

export default theme;
