import { HelmetData } from 'react-helmet';
import serialize from 'serialize-javascript';
/**
 * Get initial HTML to serve
 * @param {Object} css
 * @param {Object} assets
 * @param {String} markup
 * @param {HelmetData} helmet
 * @param {String|Undefined} initState
 */
export default (css, assets, markup, helmet, initState) => {
	return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charSet='utf-8' />
    ${helmet.title.toString()}
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500">
    ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
    ${css ? `<style id='jss-ssr'>${css}</style>` : ''}
      ${
			process.env.NODE_ENV === 'production'
				? `<script src="${assets.client.js}" defer></script>`
				: `<script src="${assets.client.js}" defer crossorigin></script>`
		}
  </head>
  <body>
    <div id="root">${markup}</div>

    <script>window.__INIT_DATA__ = ${serialize(initState ? initState : {})}</script>
  </body>
  </html>`;
};
