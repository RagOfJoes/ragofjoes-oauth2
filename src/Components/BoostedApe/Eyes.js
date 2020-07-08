import React from 'react';
import { motion } from 'framer-motion';

export default ({ animated }) => {
	const eyesAnimate = animated
		? {
				scaleY: [1, 0.05, 1],
		  }
		: {};

	const pupilAnimate = animated
		? {
				opacity: [1, 0.1, 1],
		  }
		: {};

	const eyesTransition = {
		duration: 0.5,
		loop: Infinity,
		repeatDelay: 5,
	};

	return (
		<>
			<g transform="translate(570 683)" fill="#bbabae" stroke="#323239" strokeWidth="3">
				<motion.g animate={eyesAnimate} transition={eyesTransition}>
					<circle cx="26.5" cy="26.5" r="26.5" stroke="none" />
					<circle cx="26.5" cy="26.5" r="25" fill="none" />
				</motion.g>
			</g>
			<g transform="matrix(0.788, 0.616, -0.616, 0.788, 594.441, 694.629)" fill="#323239" stroke="#323239" strokeWidth="1">
				<motion.g animate={pupilAnimate} transition={eyesTransition}>
					<circle cx="10.607" cy="10.607" r="10.607" stroke="none" />
					<circle cx="10.607" cy="10.607" r="10.107" fill="none" />
				</motion.g>
			</g>
			<g transform="translate(669 683)" fill="#bbabae" stroke="#323239" strokeWidth="3">
				<motion.g animate={eyesAnimate} transition={eyesTransition}>
					<circle cx="27" cy="27" r="27" stroke="none" />
					<circle cx="27" cy="27" r="25.5" fill="none" />
				</motion.g>
			</g>
			<g transform="matrix(0.788, 0.616, -0.616, 0.788, 693.122, 694.629)" fill="#323239" stroke="#323239" strokeWidth="1">
				<motion.g animate={pupilAnimate} transition={eyesTransition}>
					<circle cx="10.607" cy="10.607" r="10.607" stroke="none" />
					<circle cx="10.607" cy="10.607" r="10.107" fill="none" />
				</motion.g>
			</g>
		</>
	);
};
