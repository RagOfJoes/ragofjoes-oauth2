import React from 'react';
import { motion } from 'framer-motion';

export default ({ animated }) => {
	const noseAnimate = animated
		? {
				scale: [1, 1.2, 1],
		  }
		: {};
	const noseTransition = animated
		? {
				duration: 4,
				repeatDelay: 2,
				repeat: Infinity,
				repeatType: 'loop',
		  }
		: {};
	return (
		<>
			<g id="Group_11" name="Group 11" transform="translate(625 749)">
				<g
					id="Ellipse_14"
					name="Ellipse 14"
					fill="#323239"
					stroke="#323239"
					strokeWidth="3">
					<motion.g animate={noseAnimate} transition={noseTransition}>
						<circle cx="9" cy="9" r="9" stroke="none" />
						<circle cx="9" cy="9" r="7.5" fill="none" />
					</motion.g>
				</g>
			</g>
			<g id="Group_12" name="Group 12" transform="translate(652 749)">
				<g
					id="Ellipse_15"
					name="Ellipse 15"
					fill="#323239"
					stroke="#323239"
					strokeWidth="3">
					<motion.g animate={noseAnimate} transition={noseTransition}>
						<circle cx="9" cy="9" r="9" stroke="none" />
						<circle cx="9" cy="9" r="7.5" fill="none" />
					</motion.g>
				</g>
			</g>
		</>
	);
};
