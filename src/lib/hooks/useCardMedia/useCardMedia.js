export default () => ({
	root: ({ bgColor = 'rgba(0, 0, 0, 0.08)', bgPosition = 'center' }) => ({
		top: 0,
		left: 0,
		zIndex: 0,
		width: '100%',
		height: '100%',
		position: 'absolute',
		backgroundColor: bgColor,
		backgroundPosition: bgPosition,
	}),
});
