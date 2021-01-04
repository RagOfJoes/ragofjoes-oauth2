import React from 'react';
import { motion } from 'framer-motion';

export default ({ animated }) => {
	return (
		<motion.path
			fill="rgba(255,255,255,0.32)"
			transform="translate(589.687 720.376) rotate(21)"
			d="M75.033-.81c14.619,0,49.376-12.3,61.141-5.456,21.418,12.463,14.7,51.141,14.7,76.786,0,20.012,3.422,61.755-10.849,74.852-13.513,12.4-44.387-3.521-65-3.521-24.211,0-65.752-3.246-79.789-20.038C-14.744,109.864-.812,87.145-.812,70.521c0-13.788-1.84-46.851,5.48-57.939C17.93-7.506,47.806-.81,75.033-.81Z"
			animate={
				animated
					? {
							opacity: [0.2, 1, 0.2],
					  }
					: {}
			}
			transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
		/>
	);
};
