// The necessary binding(s)
export interface Bindings {
	STRIPE_API_KEY: string;
}

// The "fetch" handler
export type Handler = ExportedHandlerFetchHandler<Bindings>;

// Alias for the entire Module Worker definition
export type ModuleWorker = ExportedHandler<Bindings>;
