const isSecure = process.env.NODE_ENV === 'development';

const getShortCookies = () => {
	if (!isSecure) {
		return { httpOnly: false, signed: true };
	} else {
		return {
			signed: true,
			httpOnly: true,
			maxAge: 600000,
			overwrite: true,
			sameSite: 'lax',
		};
	}
};

const getLongCookies = () => {
	// 2 Weeks in MS
	const maxAge = 14 * 24 * 60 * 60 * 1000;
	if (!isSecure) {
		return { httpOnly: false, signed: true, maxAge };
	} else {
		return {
			maxAge,
			signed: true,
			httpOnly: true,
			overwrite: true,
			sameSite: 'none',
		};
	}
};

module.exports = { getShortCookies, getLongCookies };
