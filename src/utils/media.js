import { css } from 'styled-components';

export default {

	// Layout breakpoints

	smallOnly: (...args) => css`
		@media only screen and (max-width: 37.31em) { /* <= 597 */
			${css(...args)}
		}
	`,
	mediumOnly: (...args) => css`
		@media only screen and (min-width: 37.37em) and (max-width: 49.94em) { /* 598-799 */
			${css(...args)}
		}
	`,
	mediumDown: (...args) => css`
		@media only screen and (max-width: 49.94em) { /* <=799 */
			${css(...args)}
		}
	`,
	mediumUp: (...args) => css`
		@media only screen and (min-width: 37.37em) { /* >= 598 */
			${css(...args)}
		}
	`,
	largeOnly: (...args) => css`
		@media only screen and (min-width: 50em) and (max-width: 63.69em) { /* 800-1019 */
			${css(...args)}
		}
	`,
	largeDown: (...args) => css`
		@media only screen and (max-width: 63.69em) { /* <= 1019 */
			${css(...args)}
		}
	`,
	largeUp: (...args) => css`
		@media only screen and (min-width: 50em) { /* >= 800 */
			${css(...args)}
		}
	`,
	xlargeOnly: (...args) => css`
		@media only screen and (min-width: 63.75em) and (max-width: 85.19em) { /* 1020 - 1363 */
			${css(...args)}
		}
	`,
	xlargeDown: (...args) => css`
		@media only screen and (max-width: 85.19em) { /* <= 1336 */
			${css(...args)}
		}
	`,
	xlargeUp: (...args) => css`
		@media only screen and (min-width: 63.75em) { /* >= 1020 */
			${css(...args)}
		}
	`,
	xxlargeOnly: (...args) => css`
		@media only screen and (min-width: 85.25em) { /* >= 1364 */
			${css(...args)}
		}
	`,
	xxlargeUp: (...args) => css`
		@media only screen and (min-width: 85.25em) { /* >= 1364 */
			${css(...args)}
		}
	`
};
