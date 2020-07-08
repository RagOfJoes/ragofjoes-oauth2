export default (req, res, next) => {
	res.set('Pragma', 'no-cache');
	res.set('Cache-Control', 'no-cache, no-store');
	next();
};
