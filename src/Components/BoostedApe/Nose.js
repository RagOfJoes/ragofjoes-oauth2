import React from 'react';
import { motion } from 'framer-motion';

export default () => {
	return (
		<>
			<g transform="translate(625 749)" fill="#323239" stroke="#323239" strokeWidth="3">
				<motion.g animate={noseAnimate} transition={noseTransition}>
					<circle cx="9" cy="9" r="9" stroke="none" />
					<circle cx="9" cy="9" r="7.5" fill="none" />
				</motion.g>
			</g>
			<g transform="translate(652 749)" fill="#323239" stroke="#323239" strokeWidth="3">
				<motion.g animate={noseAnimate} transition={noseTransition}>
					<circle cx="9" cy="9" r="9" stroke="none" />
					<circle cx="9" cy="9" r="7.5" fill="none" />
				</motion.g>
			</g>
		</>
	);
};

const noseAnimate = {
	scale: [1, 1.2, 1],
};

const noseTransition = {
	duration: 4,
	loop: Infinity,
	repeatDelay: 2,
};
