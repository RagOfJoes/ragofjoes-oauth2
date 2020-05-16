const fs = require('fs');
const path = require('path');
const sass = require('node-sass');

module.exports = () => {
	sass.render(
		{
			outputStyle: 'compressed',
			file: 'public/stylesheets/scss/_layout.scss',
			outFile: 'public/stylesheets/css/index.css'
		},
		(err, res) => {
			if (err) return console.warn(err, 'SCSS compile failed!');

			fs.writeFileSync(path.join(__dirname + '/../', 'public/stylesheets/css/index.css'), res.css);
		}
	);
};
