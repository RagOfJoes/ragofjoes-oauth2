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
		repeatDelay: 5,
		repeat: Infinity,
		repeatType: 'loop',
	};

	return (
		<>
			<g id="Group_4" name="Group 4" transform="translate(570 683)">
				<g
					id="Ellipse_3"
					name="Ellipse 3"
					fill="#ccd6ed"
					stroke="#323239"
					strokeWidth="3">
					<motion.g animate={eyesAnimate} transition={eyesTransition}>
						<circle cx="26.5" cy="26.5" r="26.5" stroke="none" />
						<circle cx="26.5" cy="26.5" r="25" fill="none" />
					</motion.g>
				</g>
			</g>
			<g
				id="Group_5"
				name="Group 5"
				transform="matrix(0.788, 0.616, -0.616, 0.788, 594.441, 694.629)">
				<g
					id="Ellipse_4"
					name="Ellipse 4"
					transform="translate(0 0)"
					fill="#323239"
					stroke="#323239"
					strokeWidth="1">
					<motion.g animate={pupilAnimate} transition={eyesTransition}>
						<circle cx="10.607" cy="10.607" r="10.607" stroke="none" />
						<circle cx="10.607" cy="10.607" r="10.107" fill="none" />
					</motion.g>
				</g>
			</g>
			<g id="Group_6" name="Group 6" transform="translate(669 683)">
				<g
					id="Ellipse_5"
					name="Ellipse 5"
					fill="#ccd6ed"
					stroke="#323239"
					strokeWidth="3">
					<motion.g animate={eyesAnimate} transition={eyesTransition}>
						<circle cx="27" cy="27" r="27" stroke="none" />
						<circle cx="27" cy="27" r="25.5" fill="none" />
					</motion.g>
				</g>
			</g>
			<g
				id="Group_7"
				name="Group 7"
				transform="matrix(0.788, 0.616, -0.616, 0.788, 693.122, 694.629)">
				<g
					id="Ellipse_6"
					name="Ellipse 6"
					transform="translate(0 0)"
					fill="#323239"
					stroke="#323239"
					strokeWidth="1">
					<motion.g animate={pupilAnimate} transition={eyesTransition}>
						<circle cx="10.607" cy="10.607" r="10.607" stroke="none" />
						<circle cx="10.607" cy="10.607" r="10.107" fill="none" />
					</motion.g>
				</g>
			</g>
		</>
	);
};
