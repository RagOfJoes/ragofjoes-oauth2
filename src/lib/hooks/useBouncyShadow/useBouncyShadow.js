import { Theme } from '@material-ui/core/styles';

/**
 * @param {Theme} theme
 */
export default (theme) => ({
	root: ({ inactive }) => ({
		transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
		...(!inactive && {
			'&:hover': {
				transform: 'scale(1.02)',
				boxShadow: `0 4px 20px 0 ${theme.palette.type === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'}`,
			},
		}),
	}),
});
