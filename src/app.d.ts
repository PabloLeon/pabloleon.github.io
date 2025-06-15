// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		dataLayer: IArguments[];
		
		/* eslint-disable @typescript-eslint/no-explicit-any */
		gtag?: (...args: any[]) => void;
	}
}

declare module '$env/static/public' {
	export const PUBLIC_GA_MEASUREMENT_ID: string;
}

export {};
