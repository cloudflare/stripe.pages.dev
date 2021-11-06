import Stripe from 'stripe';
import type { Handler } from './types';

// Injected during `build` script
declare const STRIPE_API_KEY: string;

const stripe = new Stripe(STRIPE_API_KEY, {
	// Cloudflare Workers use the Fetch API for their API requests.
	httpClient: Stripe.createFetchHttpClient(),
	apiVersion: '2020-08-27',
});

function reply(message: string, status: number): Response {
	return new Response(message, { status });
}

/**
 * POST /api/checkout
 */
export const create: Handler = async function (request) {
	// Accomodates preview deployments AND custom domains
	// @example "https://<hash>.<branch>.<project>.pages.dev"
	const { origin } = new URL(request.url);

	try {
		// Create new Checkout Session for the order.
		// Redirects the customer to s Stripe checkout page.
		// @see https://stripe.com/docs/payments/accept-a-payment?integration=checkout
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: [{
				quantity: 1,
				// Reference existing item:
				//   price: PRICE_ID
				// Or, inline price data:
				price_data: {
					currency: 'usd',
					unit_amount: 2000,
					product_data: {
						name: 'T-shirt',
					}
				},
			}],
			// The `{CHECKOUT_SESSION_ID}` will be injected with the Stripe Session ID
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/canceled`,
		});

		return Response.redirect(session.url, 303);
	} catch (err) {
		return reply('Error creating session', 500);
	}
}

/**
 * GET /api/checkout?sessionid=XYZ
 */
export const lookup: Handler = async function (request) {
	const { searchParams } = new URL(request.url);

	const ident = searchParams.get('sessionid');
	if (!ident) return reply('Missing "sessionid" parameter', 400);

	try {
		const session = await stripe.checkout.sessions.retrieve(ident);
		const output = JSON.stringify(session, null, 2);
		return new Response(output, {
			headers: {
				'content-type': 'application/json; charset=utf-8'
			}
		});
	} catch (err) {
		return reply('Error retrieving Session JSON data', 500);
	}
}
