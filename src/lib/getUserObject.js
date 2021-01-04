const getUserObject = (user) => {
	return {
		email: user?.email,
		phone: user?.phone,
		isAdmin: user?.is_admin,
		name: {
			first: user?.given_name,
			last: user?.family_name,
			full: `${user?.given_name} ${user?.family_name}`,
		},
	};
};

export default getUserObject;
