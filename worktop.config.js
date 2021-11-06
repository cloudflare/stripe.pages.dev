import { define } from 'worktop.build';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// Grab a `STRIPE_API_KEY` value
const { STRIPE_API_KEY } = process.env;

export default define({
	modify(config) {
		config.plugins = config.plugins || [];
		config.plugins.push(NodeModulesPolyfillPlugin());

		config.define = {
			'STRIPE_API_KEY': JSON.stringify(STRIPE_API_KEY)
		};
	}
});
