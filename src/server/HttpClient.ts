interface DefaultHeaders {
	"Content-Type": string;
	Accept: string;
}

const DEFAULT_HEADERS: DefaultHeaders = {
	"Content-Type": "application/json;",
	Accept: "application/json",
};

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpRequestOptions {
	method: HttpMethod;
	headers?: HeadersInit;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	body?: any;
}

async function httpRequest(url: string, options: HttpRequestOptions): Promise<Response> {
	const headers = {...DEFAULT_HEADERS, ...options.headers};

	const path =
		import.meta.env.VITE_AMBIENT === "development"
			? `${SERVER_HOST}${SERVER_PORT}${url}`
			: `${SERVER_HOST}${url}`;

	return await fetch(path, {
		method: options.method,
		headers: headers,
		body: options.body ? JSON.stringify(options.body) : null,
	});
}

export async function get(endpoint: string, headers?: HeadersInit) {
	return httpRequest(endpoint, {method: "GET", headers});
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function post<T>(endpoint: string, body: any, headers?: HeadersInit) {
	return httpRequest(endpoint, {method: "POST", headers, body});
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function put(endpoint: string, body: any, headers?: HeadersInit) {
	return httpRequest(endpoint, {method: "PUT", headers, body});
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function patch(endpoint: string, body: any, headers?: HeadersInit) {
	return httpRequest(endpoint, {method: "PATCH", headers, body});
}

export async function del(endpoint: string, headers?: HeadersInit) {
	return httpRequest(endpoint, {method: "DELETE", headers});
}
