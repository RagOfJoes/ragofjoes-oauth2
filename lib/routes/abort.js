module.exports = async (provider, req, res, next) => {
	try {
		const result = {
			error: 'access_denied',
			error_description: 'End-User aborted interaction'
		};
		await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
	} catch (err) {
		next(err);
	}
};
