import * as checkout from './checkout';
import type { ModuleWorker } from './types';

const worker: ModuleWorker = {
	fetch(req, env, ctx) {
		return new Response(
			req.url
		);

		// POST /api/checkout
		if (req.method === 'POST') {
			return checkout.create(req, env, ctx);
		}

		// GET|HEAD /api/checkout
		if (req.method === 'GET' || req.method === 'HEAD') {
			return checkout.lookup(req, env, ctx);
		}
	}
}

export default worker;
