/**
 * Formats string to US phone number
 * @param {String} str
 */
const formatPhoneNumber = (str) => {
	if (typeof str !== 'string') return '';
	let phone = str.slice(0).replace(/\D/g, '');
	const match = phone.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
	if (match) {
		phone = `(${match[1]})${match[2] ? ' ' : ''}${match[2]}${match[3] ? '-' : ''}${
			match[3]
		}`;
	}
	return phone;
};

export default formatPhoneNumber;
